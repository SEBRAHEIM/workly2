import { createAdminClient } from '@/utils/supabase/admin'
import { sendEmail } from '@/utils/send-email'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    // Use a secret key to prevent unauthorized access to this endpoint
    if (key !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Find projects that are overdue (either main deadline or revision deadline)
    const { data: projects, error } = await supabase
        .from('projects')
        .select(`
            id,
            title,
            status,
            due_date,
            revision_due_date,
            client:client_id(email, full_name),
            creator:creator_id(email, full_name)
        `)
        .or(`status.eq.in_progress,status.eq.revision_requested`)
        .eq('admin_notified_overdue', false)

    if (error) {
        console.error('Error fetching projects for overdue check:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Filter manually for date logic as complex OR/LT logic in one query is tricky in Supabase without RPC
    const now = new Date().toISOString()
    const overdueProjects = (projects || []).filter(p => {
        if (p.status === 'in_progress' && p.due_date && p.due_date < now) return true
        if (p.status === 'revision_requested' && p.revision_due_date && p.revision_due_date < now) return true
        return false
    })

    if (overdueProjects.length === 0) {
        return NextResponse.json({ message: 'No overdue projects found' })
    }

    const results = []

    for (const project of overdueProjects) {
        const p = project as any
        const adminEmail = process.env.ADMIN_EMAIL || 'support@workly.day'
        const isRevisionOverdue = p.status === 'revision_requested'
        const deadline = isRevisionOverdue ? p.revision_due_date : p.due_date

        const emailContent = `
            <div style="font-family: sans-serif; padding: 20px; color: #334155; line-height: 1.5;">
                <h2 style="color: #ef4444; text-transform: uppercase; border-bottom: 1px solid #fee2e2; padding-bottom: 10px;">⚠️ Overdue Project Alert</h2>
                <p>Hello Admin,</p>
                <p>A project has passed its deadline without submission or completion. Details below:</p>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0;"><strong>Project Title:</strong> ${p.title}</p>
                    <p style="margin: 0 0 10px 0;"><strong>Issue:</strong> <span style="color: #ef4444; font-weight: 800; text-transform: uppercase;">${isRevisionOverdue ? 'Overdue Revision' : 'Overdue Initial Delivery'}</span></p>
                    <p style="margin: 0 0 10px 0;"><strong>Missed Deadline:</strong> ${deadline ? new Date(deadline).toLocaleDateString() + ' ' + new Date(deadline).toLocaleTimeString() : 'N/A'}</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;">
                    <p style="margin: 0 0 10px 0;"><strong>Creator:</strong> ${p.creator?.full_name || 'N/A'} (${p.creator?.email || 'N/A'})</p>
                    <p style="margin: 0 0 10px 0;"><strong>Client:</strong> ${p.client?.full_name || 'N/A'} (${p.client?.email || 'N/A'})</p>
                </div>

                <div style="text-center: center; margin-top: 30px;">
                    <a href="https://workly.day/hq" style="background: #0EA5E9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View in Admin Dashboard</a>
                </div>
                
                <p style="font-size: 11px; color: #94a3b8; margin-top: 40px; border-top: 1px solid #f1f5f9; pt-20;">
                    This is an automated notification from Workly Operations.
                </p>
            </div>
        `

        const emailResult = await sendEmail({
            to: adminEmail,
            subject: `[OVERDUE] ${p.title}`,
            html: emailContent
        })

        if (emailResult.success) {
            // Mark as notified so we don't send duplicate emails
            const { error: updateError } = await supabase
                .from('projects')
                .update({ admin_notified_overdue: true })
                .eq('id', p.id)

            if (updateError) {
                console.error(`Failed to update project ${p.id} status:`, updateError)
                results.push({ id: p.id, status: 'emailed_but_not_updated', error: updateError })
            } else {
                results.push({ id: p.id, status: 'success' })
            }
        } else {
            console.error(`Failed to email admin for project ${p.id}:`, emailResult.error)
            results.push({ id: p.id, status: 'email_failed', error: emailResult.error })
        }
    }

    // --- NEW: Purge Stale Unpaid Projects ---
    // User wants "unpaid work" deleted completely. 
    // We purge anything 'unpaid' created more than 2 hours ago.
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    const { error: purgeError, count: purgedCount } = await supabase
        .from('projects')
        .delete({ count: 'exact' })
        .eq('funds_status', 'unpaid')
        .lt('created_at', twoHoursAgo)

    if (purgeError) {
        console.error('Error purging stale projects:', purgeError)
    } else {
        console.log(`Successfully purged ${purgedCount} stale unpaid projects`)
    }

    return NextResponse.json({
        success: true,
        processed_overdue_count: overdueProjects.length,
        purged_unpaid_count: purgedCount || 0,
        results
    })
}

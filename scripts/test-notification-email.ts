import 'dotenv/config'
import { createNotification } from '../utils/notifications.ts'

async function testNotification() {
    console.log('--- Notification & Email Test ---')

    // Replace with a real user ID from your local DB for a full end-to-end test
    // Or just check that it fails gracefully for a fake ID
    const TEST_USER_ID = process.argv[2] || '00000000-0000-0000-0000-000000000000'

    console.log(`Testing with User ID: ${TEST_USER_ID}`)

    try {
        await createNotification({
            userId: TEST_USER_ID,
            type: 'success',
            title: 'Test Notification Alert',
            message: 'This is a verification test for the new email notification system. If you see this in your inbox, it works!',
            link: '/dashboard'
        })

        console.log('SUCCESS: Notification creation triggered.')
        console.log('Check the console output for "Simulating email send" if RESEND_API_KEY is missing, or a Resend success log.')
    } catch (error) {
        console.error('FAILED:', error)
    }
}

testNotification()

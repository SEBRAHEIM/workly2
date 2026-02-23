'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { toggleFavorite } from '@/app/(dashboard)/client/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
    creatorId: string
    initialIsFavorite: boolean
}

export default function FavoriteButton({ creatorId, initialIsFavorite }: Props) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigating to profile if inside a link
        e.stopPropagation()

        if (isLoading) return

        // Optimistic update
        const newState = !isFavorite
        setIsFavorite(newState)
        setIsLoading(true)

        if (newState) {
            toast.success('Added to Favorites')
        } else {
            toast.info('Removed from Favorites')
        }

        try {
            const result = await toggleFavorite(creatorId, newState)
            if (!result.success) {
                // Revert on failure
                setIsFavorite(!newState)
                toast.error('Failed to update favorites')
            } else {
                router.refresh()
            }
        } catch (error) {
            setIsFavorite(!newState)
            toast.error('Error updating favorites')
            console.error('Error toggling favorite:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleToggle}
            className={`flex items-center justify-center p-2 rounded-full transition-all active:scale-90 ${isFavorite ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            disabled={isLoading}
        >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
    )
}

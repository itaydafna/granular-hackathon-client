import { useState } from 'react'

export const useModelNameTooltip = () => {
    const [isModelNameTooltipOpen, setIsModelNameTooltipOpen] = useState(false)
    const openModelNameTooltip = () => setIsModelNameTooltipOpen(true)

    const closeModelNameTooltip = () => setIsModelNameTooltipOpen(false)

    return {
        isModelNameTooltipOpen,
        openModelNameTooltip,
        closeModelNameTooltip,
    }
}

import Image from 'next/image';

interface AppLogoProps {
    className?: string;
    size?: number;
}

/**
 * Reusable App Logo component — renders the unified family tree logo.
 * Use this instead of TreePine from lucide-react for brand consistency.
 * The logo SVG already includes the red gradient background + rounded corners.
 */
export function AppLogo({ className, size = 20 }: AppLogoProps) {
    return (
        <Image
            src="/logo.svg"
            alt="Gia Phả Online"
            width={size}
            height={size}
            className={`rounded-[22%] ${className ?? ''}`}
            priority
        />
    );
}

import { HTMLAttributes } from 'react';

export default function AppLogoIcon(props: HTMLAttributes<HTMLImageElement>) {
    return (
        <img 
            {...props} 
            src="/logosikp.png" 
            alt="Logo SiKP" 
            className="size-20 object-contain" 
        />
    );
}
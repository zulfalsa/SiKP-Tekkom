export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-15 items-center justify-center rounded-md overflow-hidden text-sidebar-primary-foreground">
                <img 
                    src="/logosikp.png" 
                    alt="Logo SiKP" 
                    className="size-full object-cover" 
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    SiKP-Tekkom
                </span>
            </div>
        </>
    );
}
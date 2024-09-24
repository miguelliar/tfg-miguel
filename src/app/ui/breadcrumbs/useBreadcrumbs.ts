import { useMemo } from "react";

export const useBreadcrumbs = (pathname: string) => {
    const breadcrumbs = useMemo(() => {
        const breadcrumbs = pathname.split('/')
            .map((crumb, index, crumbs) => {
                const previousPath = crumbs
                    .slice(0, index)
                    .reduce((finalPath, currentCrumb) => 
                        finalPath + currentCrumb + '/', '') || '/';

                const capizalizeCrumb = !crumb 
                    ? 'Inicio' 
                    : crumb[0].toUpperCase() + crumb.slice(1);

                return {
                    name: capizalizeCrumb, 
                    url: previousPath + crumb
                };
            });
        return breadcrumbs.slice(0, breadcrumbs.length - 1);
    }, [pathname]);

    return breadcrumbs;
}
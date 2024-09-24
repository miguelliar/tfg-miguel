'use client';
import { usePathname } from 'next/navigation'
import { useBreadcrumbs } from './useBreadcrumbs';
import { Crumb } from './Crumb';

export const Breadcrumbs = () => {
    const pathname = usePathname();
    const crumbs = useBreadcrumbs(pathname);

    return (
        crumbs.length > 1 ? 
        (<ol className='flex flex-row'>
            { crumbs.map((crumb, index, array) => {
                return (<Crumb 
                    key={crumb.url} 
                    crumb={crumb} 
                    level={index} 
                    lastLevel={array.length} 
                />);
            })}
        </ol>)
        : null
    );
};
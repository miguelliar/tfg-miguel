import Link from "next/link";

export function HeaderNavigation(): JSX.Element {
    return (
    <header className="flex justify-center">
      <Link className="mx-5 my-2" href="/">Inicio</Link>
      <Link className="mx-5 my-2" href="/proyectos">Proyectos</Link>
      <Link className="mx-5 my-2" href="/investigadores">Investigadores</Link>
    </header>);
}
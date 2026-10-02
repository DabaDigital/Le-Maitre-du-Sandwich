import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col justify-center bg-void px-5 py-32 text-paper lg:px-[5vw]">
      <p className="eyebrow text-paper/50">Erreur 404</p>
      <h1 className="display mt-6 text-[16vw] lg:text-[11vw]">
        Pas au
        <br />
        menu.
      </h1>
      <p className="mt-8 max-w-md text-paper/60">Cette page n&apos;existe pas. Mais on a de quoi vous consoler.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/menu" variant="light" size="lg">
          Voir la carte
        </ButtonLink>
        <ButtonLink href="/" variant="outline-light" size="lg">
          Accueil
        </ButtonLink>
      </div>
    </div>
  );
}

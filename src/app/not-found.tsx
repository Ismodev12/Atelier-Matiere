import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-ivory px-6 text-center">
      <div>
        <p className="eyebrow eyebrow-plain">Erreur 404</p>
        <h1 className="display-lg mt-5">Cette page n&apos;existe pas.</h1>
        <Link href="/" className="btn btn-primary mt-10">Retour à l&apos;accueil</Link>
      </div>
    </div>
  );
}

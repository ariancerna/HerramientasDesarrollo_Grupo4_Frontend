import Image from "next/image";

interface UserAvatarProps {
  nombre?: string;
  fotoUrl?: string;
  className: string;
  imageAlt?: string;
}

export default function UserAvatar({
  nombre,
  fotoUrl,
  className,
  imageAlt = "",
}: UserAvatarProps) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full ${className}`}
    >
      {fotoUrl ? (
        <Image
          src={fotoUrl}
          alt={imageAlt}
          fill
          sizes="160px"
          unoptimized
          className="object-cover"
        />
      ) : (
        nombre?.trim().charAt(0).toUpperCase() ?? "?"
      )}
    </span>
  );
}

"use client";

import Image from "next/image";
import "./brand-loader.css";

export function BrandLoader({ startup = false }: { startup?: boolean }) {
  return (
    <div className={`anaya-loading-screen${startup ? " anaya-loading-startup" : ""}`}
      role="status" aria-live="polite" aria-label="Loading Label Anaya">
      <div className="anaya-loading-stage">
        <div className="anaya-loading-halo" aria-hidden="true" />
        <div className="anaya-loading-ring anaya-loading-ring-one" aria-hidden="true" />
        <div className="anaya-loading-ring anaya-loading-ring-two" aria-hidden="true" />
        <div className="anaya-loading-ring anaya-loading-ring-three" aria-hidden="true" />
        <div className="anaya-loading-orbit" aria-hidden="true" />
        <i className="anaya-loading-spark anaya-loading-spark-one" aria-hidden="true" />
        <i className="anaya-loading-spark anaya-loading-spark-two" aria-hidden="true" />
        <i className="anaya-loading-spark anaya-loading-spark-three" aria-hidden="true" />
        <i className="anaya-loading-spark anaya-loading-spark-four" aria-hidden="true" />
        <div className="anaya-loading-emblem" aria-hidden="true">
          <Image src="/images/anaya-loader-reference.jpg" alt="" fill
            sizes="(max-width: 640px) 68vw, 431px" className="anaya-loading-reference-text" />
          <Image src="/images/anaya-golden-monogram.png" alt="" width={1221} height={1288}
            sizes="(max-width: 640px) 26vw, 165px" className="anaya-loading-monogram" />
        </div>
        <div className="anaya-loading-caption" aria-hidden="true">
          <p className="anaya-loading-messages">
            {[
              "Getting your style ready…",
              "Curating something beautiful…",
              "A little elegance is on its way…",
              "Your next favourite awaits…",
            ].map((message, index) => (
              <span key={message} style={{ animationDelay: `${index * 4}s` }}>
                {Array.from(message, (character, characterIndex) => (
                  <span className="anaya-loading-character" key={characterIndex}
                    style={{ animationDelay: `${index * 4 + characterIndex * 0.055}s` }}>{character}</span>
                ))}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

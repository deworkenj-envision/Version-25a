<div>
  <div className="overflow-hidden rounded-[2rem] border border-blue-500 bg-white shadow-2xl h-[320px] md:h-[380px] lg:h-[440px]">
    <picture>
      <source media="(max-width: 768px)" srcSet="/hero_mobile.webp" type="image/webp" />
      <source media="(max-width: 1280px)" srcSet="/hero_tablet.webp" type="image/webp" />
      <source srcSet="/hero_desktop.webp" type="image/webp" />
      <img
        src="/hero_desktop_fallback.jpg"
        alt="Printed products including postcards, business cards, flyers, and banners"
        className="block h-full w-full object-cover scale-105"
      />
    </picture>
  </div>
</div>
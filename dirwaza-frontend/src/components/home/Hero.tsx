import Image from "next/image";

type HeroData = {
    title: string;
    details: string;
    imageUrl: string;
    imageAlt: string;
};

const heroData: HeroData = {
    title: "تنتظرك تجربة متكاملة في دروازة",
    details: "A complete experience awaits you at Dirwazh",
    imageUrl: "/images/hero.svg", // Replace with your static image path
    imageAlt: "Hero Image",
};  

export default function HeroSection() {
    return (
        <section className="w-full flex flex-col items-center justify-center bg-white ">
            <div className="w-full relative">
                <Image
                    src={heroData.imageUrl}
                    alt={heroData.imageAlt}
                    width={1440}
                    height={691}
                    className="w-full h-full object-cover rounded-b-[3rem]"
                    priority
                />
                <div className="absolute inset-0 container-padding flex flex-col items-center justify-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-lg">
                        {heroData.title}
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-secondary text-center max-w-xl">
                        {heroData.details}
                    </p>
                </div>
            </div>
        </section>
    );
}
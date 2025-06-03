import { useTranslations } from "next-intl";
import Card from "../ui/Card";

export default function AboutSection() {
  const t = useTranslations("HomePage");

  return (
    <section className="bg-neutral text-center  section-padding">
      <div className="container mx-auto container-padding">
        <div className="grid grid-cols-1  gap-10 items-center">
          <h2 className="text-xl md:text-2xl font-bold ">
            {t("about.title")}
          </h2>
          <Card className="p-6 md:p-10 xl:p-16 max-w-3xl mx-auto w-full shadow-xl border-0 rounded-none rounded-br-[2.5rem]   rounded-tl-[2.5rem] ">
            <p className="text-lg font-medium max-w-96 mx-auto">
              {t("about.description")}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}

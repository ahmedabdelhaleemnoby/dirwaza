import { useTranslations } from 'next-intl';
import Card from '../ui/Card';



export default function FAQSection() {
  const t = useTranslations("HomePage");

  
  const faqs = [
    {
      question: t('faq.question1'),
      answer: t('faq.answer1')
    },
    {
      question: t('faq.question2'),
      answer: t('faq.answer2')
    },
    {
      question: t('faq.question3'),
      answer: t('faq.answer3')
    },
    {
      question: t('faq.question4'),
      answer: t('faq.answer4')
    }
  ];

    return (
         <section className="section-padding bg-neutral-dark ">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              {t('faq.title')}
            </h2>
            <p className="text-primary-dark max-w-2xl mx-auto">
              {t('faq.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1  gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-bold mb-2 text-primary">{faq.question}</h3>
                <p className="text-primary-dark">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
};


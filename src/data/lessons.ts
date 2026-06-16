import { TextLesson } from "../types";

export const TEXT_LESSONS: TextLesson[] = [
  {
    id: "boulangerie-haute-couture",
    title: "La Boulangerie Traditionnelle : Au-delà du Pain",
    difficulty: "B1",
    category: "Culture",
    text: `En France, la boulangerie n'est pas un simple commerce, c'est une institution sociale. Chaque matin, des millions de Français franchissent le seuil de leur boulangerie de quartier pour y acheter une baguette « tradition ». Contrairement à la baguette ordinaire, la tradition est réglementée par un décret présidentiel de 1993 : elle doit être fabriquée sur place, sans aucun additif ni congélation, uniquement avec de la farine, de l'eau, du sel et de la levure. 

Mais au-delà de la technique, la boulangerie joue le rôle de liant social. On y échange des nouvelles du quartier, on y commente le temps ou l'actualité. C'est un rituel immuable qui résiste à l'ère numérique. Depuis 2022, les savoir-faire artisanaux et la culture de la baguette sont officiellement inscrits au patrimoine culturel immatériel de l'UNESCO, consacrant ainsi l'importance de ce symbole national dans le cœur des Français.`,
    englishSummary: "In France, local bakeries are more than mere shops; they represent a major social institution. The 'baguette tradition' is heavily regulated by a 1993 presidential decree to protect local craftsmanship, using only natural ingredients and no freezing. Bakeries foster daily face-to-face social connections, earning the craft a spot on UNESCO's Intangible Cultural Heritage list in 2022.",
    vocabulary: [
      {
        term: "franchir le seuil",
        translation: "to cross the threshold",
        example: "Chaque matin, les clients s'empressent de franchir le seuil de la boutique."
      },
      {
        term: "réglementée",
        translation: "regulated",
        example: "La production du fromage de brebis est strictement réglementée."
      },
      {
        term: "liant social",
        translation: "social bond / glue",
        example: "Les marchés de plein air agissent comme un véritable liant social."
      },
      {
        term: "immuable",
        translation: "unchangeable / timeless",
        example: "Le rituel du café du matin reste immuable au fil des ans."
      },
      {
        term: "patrimoine culturel immatériel",
        translation: "intangible cultural heritage",
        example: "Les chants corses font partie du patrimoine culturel immatériel."
      }
    ],
    quiz: [
      {
        question: "Qu'est-ce qui distingue la baguette « tradition » de la baguette ordinaire selon le décret de 1993 ?",
        options: [
          "Elle contient du beurre de Normandie.",
          "Elle est fabriquée sur place sans additifs ni congélation.",
          "Elle doit obligatoirement peser exactement 500 grammes.",
          "Elle est cuite au feu de bois uniquement."
        ],
        correctIndex: 1,
        explanation: "Le texte indique que la baguette tradition doit être fabriquée sur place, sans aucun additif ni congélation.",
        translation: "What distinguishes the 'tradition' baguette from the ordinary baguette according to the 1993 decree? It must be made on-site without additives or freezing."
      },
      {
        question: "Quel rôle social majeur joue la boulangerie de quartier d'après l'auteur ?",
        options: [
          "Elle prête de l'argent aux résidents.",
          "Elle fait office d'hôtel de ville miniature.",
          "Elle sert de lieu d'échange et de lien social entre résidents.",
          "Elle remplace la presse écrite locale."
        ],
        correctIndex: 2,
        explanation: "La boulangerie sert de 'liant social' où l'on échange les dernières nouvelles du quartier.",
        translation: "What major social role does the neighborhood bakery play according to the author? It serves as a place for exchanges and social bonds between residents."
      },
      {
        question: "En quelle année la culture de la baguette a-t-elle été inscrite à l'UNESCO ?",
        options: [
          "En 1993",
          "En 2000",
          "En 2022",
          "En 2026"
        ],
        correctIndex: 2,
        explanation: "Le texte précise que l'inscription au patrimoine mondial immatériel de l'UNESCO a eu lieu en 2022.",
        translation: "In which year was baguette culture inscribed in UNESCO? In 2022."
      }
    ]
  },
  {
    id: "paris-haussmannien",
    title: "Comment Haussmann a Réinventé Paris",
    difficulty: "B2",
    category: "Histoire",
    text: `Sous le Second Empire, au milieu du XIXe siècle, Paris était encore une ville médiévale : sombre, insalubre, étouffante et sujette à de fréquentes épidémies de choléra. Les rues étaient si étroites que le peuple pouvait facilement y ériger des barricades en cas d'insurrection. Napoléon III, désireux de rivaliser avec la modernité de Londres, confie alors une mission titanesque au baron Georges Eugène Haussmann : aérer, unifier et embellir la capitale française.

Haussmann ordonne alors des destructions massives au cœur historique pour tracer de grandes avenues rectilignes, appelées boulevards. Ces percées facilitent la circulation automobile, favorisent le commerce des Grands Magasins naissants, et surtout, permettent le déploiement rapide des forces de l'ordre face aux révoltes. L'architecture haussmannienne naît ainsi, caractérisée par ses façades ordonnancées en pierre de taille, ses balcons filants aux deuxième et cinquième étages, et une hauteur d'immeuble proportionnelle à la largeur de la voie. Bien que critiqué pour le coût exorbitant de ses travaux et la destruction de pans entiers d'histoire médiévale, Haussmann a façonné l'image éternelle que le monde entier se fait de Paris aujourd'hui.`,
    englishSummary: "During the mid-19th century, Napoleon III tasked Baron Haussmann with modernizing Paris, which was dark, crowded, and plagued by epidemics. Haussmann completely redesigned Paris by building wide, straight boulevards, public parks, and standardizing architectural styles (stone facades and continuous balconies). This also prevented rebels from building barricades.",
    vocabulary: [
      {
        term: "insalubre",
        translation: "unhealthy / squalid / unsanitary",
        example: "Ces logements insalubres ont été déclarés impropres à l'habitation."
      },
      {
        term: "ériger des barricades",
        translation: "to build barricades",
        example: "Lors de la révolution de 1848, les insurgés ont érigé des barricades dans le centre."
      },
      {
        term: "mission titanesque",
        translation: "colossal / gargantuan task",
        example: "Reconstruire la cathédrale après l'incendie a constitué une mission titanesque."
      },
      {
        term: "immeubles en pierre de taille",
        translation: "ashlar / cut stone buildings",
        example: "Les somptueux immeubles en pierre de taille longent les avenues parisiennes."
      },
      {
        term: "balcons filants",
        translation: "continuous balconies",
        example: "Le deuxième étage bénéficie généralement d'un balcon filant d'une grande valeur esthétique."
      }
    ],
    quiz: [
      {
        question: "Pourquoi les rues étroites médiévales de Paris posaient-elles un problème politique au pouvoir ?",
        options: [
          "Elles empêchaient les carrosses royaux de rouler vite.",
          "Elles permettaient aux insurgés d'ériger facilement des barricades lors des révoltes.",
          "Le coût de nettoyage y était trois fois supérieur.",
          "La reine n'aimait pas le style architectural du Moyen Âge."
        ],
        correctIndex: 1,
        explanation: "Le texte mentionne expressément que les rues étroites facilitaient l'érection de barricades en cas d'insurrection.",
        translation: "Why did the narrow medieval streets of Paris pose a political problem to the rulers? They allowed insurgents to easily erect barricades during revolts."
      },
      {
        question: "Quelle est une des caractéristiques majeures de l'architecture haussmannienne ?",
        options: [
          "Des clochers gothiques pointus en haut de chaque bâtiment.",
          "Les façades peintes en couleurs chaudes comme en Italie ou en Espagne.",
          "Des façades en pierre de taille avec un balcon filant aux deuxième et cinquième étages.",
          "L'absence totale de fenêtres donnant sur la rue."
        ],
        correctIndex: 2,
        explanation: "L'architecture se caractérise par des façades ordonnancées en pierre de taille et des balcons filants au 2e et 5e étage.",
        translation: "What is a major characteristic of Haussmannian architecture? Ashlar stone facades with continuous balconies on the second and fifth floors."
      },
      {
        question: "Qui a confié cette mission de rénovation au baron Haussmann ?",
        options: [
          "Louis-Philippe Ier",
          "Charles de Gaulle",
          "Napoléon III",
          "Victor Hugo"
        ],
        correctIndex: 2,
        explanation: "Le texte stipule que c'est l'empereur Napoléon III qui confie cette mission titanesque au baron Haussmann.",
        translation: "Who entrusted this renovation mission to Baron Haussmann? Napoleon III."
      }
    ]
  },
  {
    id: "teletravail-france",
    title: "Le Télétravail en France : Un Nouveau Contrat Social ?",
    difficulty: "B2",
    category: "Société",
    text: `Depuis la crise sanitaire de 2020, le télétravail s'est imposé dans le quotidien de nombreux salariés français, bouleversant les rapports professionnels et personnels. Autrefois perçu avec méfiance par un management axé sur le présentéisme, le fait de travailler depuis chez soi fait désormais partie intégrante des chartes d'entreprise et des négociations syndicales. Beaucoup apprécient de s'épargner les temps de trajet pénibles dans le métro ou les embouteillages, ce qui contribue à un meilleur équilibre entre vie professionnelle et privée.

Cependant, cette mutation numérique en profondeur soulève d'importants débats. Certains syndicats s'alarment d'une détérioration du lien social et d'une surcharge cognitive, où la frontière entre le bureau et la maison s'amenuise au détriment du « droit à la déconnexion », un droit légiféré en France depuis 2017. De plus, une fracture sociologique s'opère : alors que les cadres supérieurs peuvent aisément l'adopter, les ouvriers, les employés de commerce et les soignants se voient privés de cette flexibilité matérielle. Le gouvernement français tente de réguler ces nouvelles pratiques pour s'assurer que le domicile ne devienne pas une succursale d'exploitation continue. Le défi futur réside dans un juste milieu : allier autonomie moderne et protection des individus.`,
    englishSummary: "Since 2020, teleworking has changed French work dynamics. Once viewed skeptically by managers obsessed with 'presenteeism', remote working is now part of corporate policies. While employees value avoiding tiring daily commutes, concerns arise regarding the lack of clear boundaries and cognitive overload, threatening France's legally protected 'right to disconnect'. It also highlights a class disparity, since remote options are mainly accessible to desk-bound white-collar workers.",
    vocabulary: [
      {
        term: "présentéisme",
        translation: "presenteeism (culture of being physically present)",
        example: "Le présentéisme en entreprise pénalise souvent l'efficacité réelle des équipes."
      },
      {
        term: "s'épargner les trajets",
        translation: "to spare oneself the commute",
        example: "Travailler deux jours par semaine à domicile permet de s'épargner les trajets."
      },
      {
        term: "s'amenuiser",
        translation: "to shrink / wear away / diminish",
        example: "Avec la nuit qui tombe, notre espoir de finir le travail à l'heure s'amenuise."
      },
      {
        term: "droit à la déconnexion",
        translation: "right to disconnect",
        example: "Le droit à la déconnexion interdit à l'employeur d'exiger des réponses par email après 20 heures."
      },
      {
        term: "succursale",
        translation: "branch / sub-office",
        example: "Ils ont ouvert une nouvelle succursale de la marque à Lyon."
      }
    ],
    quiz: [
      {
        question: "Quelle mentalité d'entreprise faisait autrefois obstacle au développement du télétravail en France ?",
        options: [
          "L'absence totale d'ordinateurs.",
          "Une culture managériale fondée sur le présentéisme de l'employé.",
          "La loi qui interdisait de communiquer en dehors des bureaux.",
          "La préférence pour le travail écrit à la main."
        ],
        correctIndex: 1,
        explanation: "Le texte mentionne que le télétravail était autrefois perçu avec méfiance par un management axé sur le présentéisme (être impérativement présent physiquement).",
        translation: "What corporate mentality formerly blocked the growth of teleworking in France? A managerial culture based on presenteeism."
      },
      {
        question: "Qu'est-ce que le « droit à la déconnexion » mentionné dans l'article ?",
        options: [
          "Le droit d'éteindre son téléphone pendant les heures de réunion importantes.",
          "Le droit de suspendre sa ligne internet professionnelle pour non-paiement.",
          "Le droit légal de ne pas répondre aux sollicitations professionnelles en dehors des heures de travail.",
          "L'obligation de débrancher tous les appareils électriques d'un bureau le week-end."
        ],
        correctIndex: 2,
        explanation: "Le droit à la déconnexion (légiféré en 2017) garantit à l'employé le droit de ne pas être sollicité en dehors du temps de travail.",
        translation: "What is the 'right to disconnect' mentioned in the article? The legal right not to answer work contacts outside of working hours."
      },
      {
        question: "Pourquoi parle-t-on d'un risque d'inégalité ou de « fracture sociologique » ?",
        options: [
          "Parce que les abonnements internet coûtent trop cher.",
          "Parce que les cadres en profitent alors que de nombreux métiers physiques (ouvriers, soignants) ne le peuvent pas.",
          "Parce que les femmes y ont deux fois moins accès que les hommes en France.",
          "Parce que l'État refuse d'installer la fibre optique à la campagne."
        ],
        correctIndex: 1,
        explanation: "Le texte note qu'une fracture s'opère car alors que les cadres l'adoptent, de nombreux métiers physiques (ouvriers, employés de commerce, soignants) en sont matériellement exclus.",
        translation: "Why is there mention of a risk of inequality or 'sociological fracture'? Because executives can benefit from it while many physical professions (workers, caregivers) cannot."
      }
    ]
  }
];

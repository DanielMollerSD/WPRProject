# WPRProject

### First time install:
`dotnet tool install --global dotnet-ef`  
`dotnet dev-certs https --trust`

### After cloning:
`npm i` in frontend  
`dotnet restore` in backend  
`dotnet ef database update` in backend  

### To run application:
`npm run dev` in frontend  
`dotnet run` in backend  

### Database commands:
`dotnet ef migrations add InitialCreate`  
`dotnet ef database update`

### OPTIONAL:
Make DUMMY DATA using SQL Server Management Studio 20:
```sql
-- Vehicles Table Test Data
INSERT INTO Vehicle (LicensePlate, Brand, Model, Color, Status, Note, Price, PurchaseYear, VehicleType, ImageUrl) VALUES
('AB-123-CD', 'BMW', '3 Series', 'Black', 'Beschikbaar', 'Luxe sedan in uitstekende staat', 75, 2019, 'Car', 'src/assets/vehicles/BMW 3 Series.jpg'),
('EF-456-GH', 'Volkswagen', 'Passat', 'White', 'Beschikbaar', 'Ruime en comfortabele gezinsauto', 60, 2018, 'Car', 'src/assets/vehicles/Volkswagen Passat.jpg'),
('IJ-789-KL', 'Ford', 'Focus', 'Blue', 'Beschikbaar', 'Betrouwbare en zuinige compacte auto', 50, 2020, 'Car', 'src/assets/vehicles/Ford Focus.webp'),
('MN-101-OP', 'Fiat', 'Ducato Camper', 'Grey', 'Beschikbaar', 'Volledig uitgerust voor lange reizen', 150, 2021, 'Camper', 'src/assets/vehicles/Fiat Ducato Camper.jpg'),
('QR-234-ST', 'Mercedes-Benz', 'V-Class Camper', 'Black', 'Beschikbaar', 'Premium camper met moderne voorzieningen', 180, 2022, 'Camper', 'src/assets/vehicles/Mercedes-Benz Camper.jpg'),
('UV-567-WX', 'Volkswagen', 'California', 'Red', 'Beschikbaar', 'Compacte camper ideaal voor koppels', 140, 2020, 'Camper', 'src/assets/vehicles/Volkswagen California.jpg'),
('YZ-890-AB', 'Bailey', 'Phoenix 440', 'White', 'Beschikbaar', 'Compacte caravan voor kleine gezinnen', 90, 2018, 'Caravan', 'src/assets/vehicles/Bailey Phoenix 440.jpg'),
('CD-123-EF', 'Swift', 'Conqueror 560', 'Silver', 'Beschikbaar', 'Luxe caravan met volledige voorzieningen', 130, 2021, 'Caravan', 'src/assets/vehicles/Swift Conqueror 560.jpg'),
('GH-456-IJ', 'Coachman', 'Pastiche 545', 'Blue', 'Beschikbaar', 'Ruime caravan met modern interieur', 110, 2019, 'Caravan', 'src/assets/vehicles/Coachman Pastiche 545.jpg'),
('KL-789-MN', 'Audi', 'A4', 'White', 'Beschikbaar', 'Luxe sedan met geweldige prestaties', 85, 2021, 'Car', 'src/assets/vehicles/Audi A4.jpg'),
('OP-101-QR', 'Toyota', 'Corolla', 'Silver', 'Beschikbaar', 'Betrouwbare en budgetvriendelijke auto', 55, 2017, 'Car', 'src/assets/vehicles/Toyota Corolla.jpg'),
('ST-234-UV', 'Hymer', 'B-Class Camper', 'White', 'Beschikbaar', 'Premium camper met topvoorzieningen', 200, 2023, 'Camper', 'src/assets/vehicles/Hymer B-Class Camper.png'),
('WX-567-YZ', 'Ford', 'Mondeo', 'Red', 'Beschikbaar', 'Comfortabele middenklasse auto voor gezinnen', 65, 2019, 'Car', 'src/assets/vehicles/Ford Mondeo.jpg'),
('AB-678-CD', 'Skoda', 'Octavia', 'Grey', 'Beschikbaar', 'Zuinig en ruime hatchback', 60, 2020, 'Car', 'src/assets/vehicles/Skoda Octavia.jpg'),
('EF-901-GH', 'Hobby', 'Prestige 720', 'White', 'Beschikbaar', 'Grote caravan ideaal voor groepsreizen', 150, 2022, 'Caravan', 'src/assets/vehicles/Hobby Prestige 720.jpg'),
('IJ-345-KL', 'Volvo', 'XC60', 'Black', 'Beschikbaar', 'Veilige en stijlvolle middenklasse auto', 95, 2021, 'Car', 'src/assets/vehicles/Volvo XC60.webp'),
('MN-678-OP', 'Fiat', 'Doblo Camper', 'Blue', 'Beschikbaar', 'Compacte camper met basisvoorzieningen', 120, 2019, 'Camper', 'src/assets/vehicles/Fiat Doblo Camper.jpg'),
('QR-901-ST', 'Jeep', 'Compass', 'Grey', 'Beschikbaar', 'Robuuste SUV voor avontuurlijke reizen', 100, 2020, 'Car', 'src/assets/vehicles/Jeep Compass.jpg'),
('UV-234-WX', 'Knaus', 'Sport 500', 'Silver', 'Beschikbaar', 'Veelzijdige caravan voor buitenreizen', 100, 2021, 'Caravan', 'src/assets/vehicles/Knaus Sport 500.jpg'),
('YZ-567-AB', 'Mazda', 'CX-5', 'White', 'Beschikbaar', 'Sportieve SUV met geavanceerde functies', 90, 2019, 'Car', 'src/assets/vehicles/Mazda CX-5.jpg');

INSERT INTO Subscription VALUES('Discount', 'Procentuele korting op je huur!', 350, 'Discount', 20, null);
INSERT INTO Subscription VALUES('Coverage', '10 huurdagen worden bedekt!', 1000, 'Coverage', null, 10);

INSERT INTO Privacy (Description)
VALUES ('Privacybeleid
Laatste update: 26 januari 2025

Dit Privacybeleid beschrijft onze beleidslijnen en procedures met betrekking tot het verzamelen, gebruiken en openbaar maken van uw informatie wanneer u de Service gebruikt en informeert u over uw privacyrechten en hoe de wet u beschermt.

We gebruiken uw persoonlijke gegevens om de Service te leveren en te verbeteren. Door de Service te gebruiken, gaat u akkoord met het verzamelen en gebruiken van informatie in overeenstemming met dit Privacybeleid.

Interpretatie en Definities

Interpretatie
De woorden waarvan de eerste letter een hoofdletter heeft, hebben de betekenissen die onder de volgende voorwaarden zijn gedefinieerd. De volgende definities hebben dezelfde betekenis, ongeacht of ze in het enkelvoud of meervoud voorkomen.

Definities
Voor de doeleinden van dit Privacybeleid:

    Account betekent een uniek account dat voor u is aangemaakt om toegang te krijgen tot onze Service of delen van onze Service.
    Affiliate betekent een entiteit die controle heeft over, gecontroleerd wordt door of onder gemeenschappelijke controle staat met een partij, waarbij "controle" betekent dat 50% of meer van de aandelen, eigendomsbelangen of andere effecten die recht geven op stemrecht voor de verkiezing van bestuurders of andere beheersautoriteit in bezit zijn.
    Bedrijf (verwezen naar als "het Bedrijf", "Wij", "Ons" of "Onze" in deze Overeenkomst) verwijst naar Cars And All B.V., Anna van Buerenplein 13, 2595 DG.
    Cookies zijn kleine bestanden die op uw computer, mobiele apparaat of ander apparaat worden geplaatst door een website, die de details van uw browsegeschiedenis op die website bevatten, naast andere toepassingen.
    Land verwijst naar: Nederland
    Apparaat betekent elk apparaat dat toegang kan krijgen tot de Service, zoals een computer, mobiele telefoon of digitaal tablet.
    Persoonsgegevens zijn alle informatie die betrekking heeft op een geïdentificeerde of identificeerbare persoon.
    Service verwijst naar de Website.
    Serviceprovider betekent elke natuurlijke of juridische persoon die gegevens verwerkt namens het Bedrijf. Dit verwijst naar derden of individuen die door het Bedrijf zijn aangesteld om de Service te vergemakkelijken, de Service namens het Bedrijf te leveren, diensten met betrekking tot de Service uit te voeren of het Bedrijf te helpen bij het analyseren van hoe de Service wordt gebruikt.
    Gebruik Gegevens verwijst naar gegevens die automatisch worden verzameld, hetzij gegenereerd door het gebruik van de Service, hetzij door de infrastructuur van de Service zelf (bijvoorbeeld de duur van een pagina bezoek).
    Website verwijst naar Cars And All, toegankelijk via https://CarsAndAll.nl
    U verwijst naar de persoon die de Service bezoekt of gebruikt, of het bedrijf of andere juridische entiteit namens wie zo''n persoon de Service bezoekt of gebruikt, afhankelijk van de situatie.

Verzamelen en Gebruiken van uw Persoonsgegevens

Soorten Verzamelde Gegevens

Persoonsgegevens
Tijdens het gebruik van onze Service, kunnen we u vragen om bepaalde persoonlijk identificeerbare informatie te verstrekken die gebruikt kan worden om u te contacteren of te identificeren. Persoonlijk identificeerbare informatie kan onder andere het volgende omvatten:

    E-mailadres
    Voornaam en achternaam
    Telefoonnummer
    Adres, Staat, Provincie, Postcode, Stad

Gebruik Gegevens
Gebruik Gegevens worden automatisch verzameld tijdens het gebruik van de Service. Deze gegevens kunnen informatie omvatten zoals het IP-adres van uw apparaat, het type browser, de browser versie, de pagina''s van onze Service die u bezoekt, het tijdstip en de datum van uw bezoek, de tijd die u op die pagina’s doorbrengt, unieke apparaat identificatie en andere diagnostische gegevens.

Wanneer u de Service benadert via een mobiel apparaat, kunnen we bepaalde informatie automatisch verzamelen, inclusief maar niet beperkt tot het type mobiel apparaat dat u gebruikt, de unieke ID van uw mobiele apparaat, het IP-adres van uw mobiele apparaat, het besturingssysteem van uw mobiele apparaat, het type mobiel internetbrowser dat u gebruikt, unieke apparaatidentifiers en andere diagnostische gegevens.

We kunnen ook informatie verzamelen die uw browser verzendt telkens wanneer u onze Service bezoekt of wanneer u toegang krijgt tot de Service via of via een mobiel apparaat.

Trackingtechnologieën en Cookies
We gebruiken Cookies en soortgelijke trackingtechnologieën om de activiteit op onze Service te volgen en bepaalde informatie op te slaan. De gebruikte trackingtechnologieën zijn onder andere beacons, tags en scripts om informatie te verzamelen en te volgen, en om onze Service te verbeteren en te analyseren. De technologieën die we gebruiken kunnen het volgende omvatten:

• Cookies of Browsercookies: Een cookie is een klein bestand dat op uw apparaat wordt geplaatst. U kunt uw browser instrueren om alle cookies te weigeren of aan te geven wanneer een cookie wordt verzonden. Als u echter geen cookies accepteert, kunt u mogelijk niet sommige delen van onze Service gebruiken. Tenzij u uw browserinstellingen heeft aangepast om cookies te weigeren, kan onze Service cookies gebruiken.
• Web Beacons: Bepaalde secties van onze Service en onze e-mails kunnen kleine elektronische bestanden bevatten, die web beacons worden genoemd (ook wel clear gifs, pixel tags, en single-pixel gifs genoemd), waarmee het Bedrijf bijvoorbeeld kan tellen hoeveel gebruikers die pagina’s hebben bezocht of een e-mail hebben geopend, en voor andere gerelateerde website-statistieken (bijvoorbeeld het opnemen van de populariteit van een bepaalde sectie en het verifiëren van systeem- en serverintegriteit).

Cookies kunnen "Persistente" of "Sessie" Cookies zijn. Persistente Cookies blijven op uw persoonlijke computer of mobiel apparaat wanneer u offline gaat, terwijl Sessie Cookies worden verwijderd zodra u uw webbrowser sluit.

Gebruik van uw Persoonsgegevens
Het Bedrijf kan Persoonsgegevens gebruiken voor de volgende doeleinden:

    Om onze Service te leveren en te onderhouden, inclusief het monitoren van het gebruik van de Service.
    Om uw Account te beheren: het beheren van uw registratie als gebruiker van de Service. De Persoonsgegevens die u verstrekt, geven u toegang tot verschillende functionaliteiten van de Service die beschikbaar zijn voor u als geregistreerde gebruiker.
    Voor de uitvoering van een contract: de ontwikkeling, naleving en uitvoering van het aankoopcontract voor de producten, items of diensten die u heeft aangeschaft of van enig ander contract met ons via de Service.
    Om contact met u op te nemen: via e-mail, telefoongesprekken, SMS of andere equivalente vormen van elektronische communicatie, zoals pushmeldingen van mobiele applicaties met updates of informatieve communicatie over de functionaliteiten, producten of contractuele diensten, inclusief beveiligingsupdates, wanneer dit nodig of redelijk is voor hun uitvoering.

Het Bedrijf kan uw persoonsgegevens delen in de volgende situaties:

• Met Serviceproviders: Wij kunnen uw persoonsgegevens delen met Serviceproviders om het gebruik van onze Service te monitoren en te analyseren, of om contact met u op te nemen.
• Voor bedrijfsovername: Wij kunnen uw persoonsgegevens delen of overdragen in verband met of tijdens de onderhandelingen over een fusie, verkoop van bedrijfsactiva, financiering of verwerving van een deel van onze onderneming door een ander bedrijf.

Beveiliging van uw Persoonsgegevens
De beveiliging van uw persoonsgegevens is belangrijk voor ons, maar onthoud dat geen enkele methode van overdracht via het internet, of methode van elektronische opslag 100% veilig is. Hoewel we ons best doen om uw persoonsgegevens commercieel acceptabel te beschermen, kunnen we de absolute veiligheid ervan niet garanderen.

Contact met Ons
Als u vragen heeft over dit Privacybeleid, kunt u contact met ons opnemen via:

E-mail: CarsAndAllRental@gmail.com
Postadres: Anna van Buerenplein 13, 2595 DG, Den Haag');

-- Show new Test Data
SELECT * FROM Vehicle;
```
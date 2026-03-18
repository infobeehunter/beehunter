import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Parse DATABASE_URL o usa variabili individuali
const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      return {
        host: url.hostname,
        port: parseInt(url.port || "3306"),
        user: url.username,
        password: url.password,
        database: url.pathname.substring(1),
        ssl: {
          rejectUnauthorized: false,
        },
      };
    } catch (e) {
      console.error("Errore nel parsing DATABASE_URL:", e.message);
    }
  }
  return {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "beehunter",
  };
};

const config = getDatabaseConfig();
console.log("📡 Connessione a database:", config.host, ":", config.port);

const pool = mysql.createPool({
  connectionLimit: 1,
  ...config,
});

async function seedDatabase() {
  const connection = await pool.getConnection();

  try {
    console.log("🌱 Inizio seed del database BeeHunter...\n");

    // 1. Seed Partners (Commercianti)
    console.log("📍 Creazione partner commerciali...");
    const partners = [
      {
        name: "Ristorante Bari Vecchia",
        email: "info@barivecchia.it",
        category: "Ristorazione",
        city: "Bari",
        verified: true,
      },
      {
        name: "Gelato Artigianale Puglia",
        email: "info@gelatoartigianale.it",
        category: "Dolci",
        city: "Bari",
        verified: true,
      },
      {
        name: "Boutique Moda Bari",
        email: "info@boutiquemoda.it",
        category: "Moda",
        city: "Bari",
        verified: true,
      },
      {
        name: "Caffè Letterario",
        email: "info@caffelitterario.it",
        category: "Caffetteria",
        city: "Bari",
        verified: true,
      },
      {
        name: "Libreria Mondadori",
        email: "info@libreriamondadori.it",
        category: "Libri",
        city: "Bari",
        verified: true,
      },
    ];

    // Per i partner, abbiamo bisogno di un userId, usiamo un dummy user per il seed
    // Creiamo un utente dummy per i partner
    const dummyEmail = "partners-seed-" + Date.now() + "@beehunter.app";
    const [dummyUser] = await connection.execute(
      "INSERT INTO users (openId, name, email, loginMethod, role) VALUES (?, ?, ?, ?, ?)",
      ["partner-seed-" + Date.now(), "Partner Seed User", dummyEmail, "system", "user"]
    );
    const dummyUserId = dummyUser.insertId;

    const partnerIds = [];
    for (const partner of partners) {
      const [result] = await connection.execute(
        "INSERT INTO partners (userId, businessName, category, description, location, contactEmail, verified) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [dummyUserId, partner.name, "Other", partner.category, "Bari", partner.email, partner.verified]
      );
      partnerIds.push(result.insertId);
    }
    console.log(`✅ ${partners.length} partner creati\n`);

    // 2. Seed POI (Punti di Interesse)
    console.log("🗺️  Creazione POI di Bari...");
    const pois = [
      // Cultura
      {
        name: "Basilica di San Nicola",
        description: "Una delle chiese più importanti della cristianità, dedicata a San Nicola di Bari",
        category: "Cultura",
        latitude: 41.1351,
        longitude: 16.8746,
        xpReward: 150,
      },
      {
        name: "Cattedrale di Bari",
        description: "Splendida cattedrale romanica nel cuore della città vecchia",
        category: "Cultura",
        latitude: 41.1365,
        longitude: 16.8751,
        xpReward: 120,
      },
      {
        name: "Castello Normanno-Svevo",
        description: "Fortezza medievale con vista sul mare, simbolo di Bari",
        category: "Cultura",
        latitude: 41.1332,
        longitude: 16.8703,
        xpReward: 140,
      },
      {
        name: "Pinacoteca Corrado Giaquinto",
        description: "Museo d'arte con opere di maestri pugliesi e italiani",
        category: "Cultura",
        latitude: 41.1256,
        longitude: 16.8687,
        xpReward: 100,
      },
      {
        name: "Teatro Petruzzelli",
        description: "Uno dei più importanti teatri d'Italia, capolavoro dell'architettura",
        category: "Cultura",
        latitude: 41.1308,
        longitude: 16.8663,
        xpReward: 130,
      },

      // Natura
      {
        name: "Lungomare di Bari",
        description: "Bellissima passeggiata sul mare con vista sul porto",
        category: "Natura",
        latitude: 41.1298,
        longitude: 16.8625,
        xpReward: 80,
      },
      {
        name: "Parco 2 Giugno",
        description: "Grande parco urbano con alberi, panchine e aree gioco",
        category: "Natura",
        latitude: 41.1198,
        longitude: 16.8721,
        xpReward: 70,
      },
      {
        name: "Spiaggia Pane e Pomodoro",
        description: "Spiaggia attrezzata nel centro città, perfetta per una nuotata",
        category: "Natura",
        latitude: 41.1268,
        longitude: 16.8598,
        xpReward: 90,
      },

      // Food
      {
        name: "Orecchiette con Cime di Rapa",
        description: "Piatto tipico barese da assaggiare nei ristoranti locali",
        category: "Food",
        latitude: 41.1365,
        longitude: 16.8751,
        xpReward: 60,
      },
      {
        name: "Tiella di Riso Patate e Cozze",
        description: "Specialità pugliese da provare nei migliori ristoranti",
        category: "Food",
        latitude: 41.1308,
        longitude: 16.8663,
        xpReward: 70,
      },
      {
        name: "Focaccia Barese",
        description: "Pane tradizionale pugliese, soffice e saporito",
        category: "Food",
        latitude: 41.1256,
        longitude: 16.8687,
        xpReward: 50,
      },
      {
        name: "Panzerotti Fritti",
        description: "Specialità street food barese, da gustare caldi",
        category: "Food",
        latitude: 41.1365,
        longitude: 16.8751,
        xpReward: 55,
      },
      {
        name: "Gelato Artigianale",
        description: "Gelato fatto in casa con ingredienti freschi e genuini",
        category: "Food",
        latitude: 41.1308,
        longitude: 16.8663,
        xpReward: 45,
      },

      // Eventi
      {
        name: "Fiera del Levante",
        description: "Grande fiera internazionale che si tiene ogni anno a Bari",
        category: "Eventi",
        latitude: 41.1089,
        longitude: 16.8821,
        xpReward: 200,
      },
      {
        name: "Festa di San Nicola",
        description: "Celebrazione annuale del patrono di Bari con processioni e fuochi",
        category: "Eventi",
        latitude: 41.1351,
        longitude: 16.8746,
        xpReward: 180,
      },
      {
        name: "Notte della Taranta",
        description: "Festival musicale estivo con artisti internazionali",
        category: "Eventi",
        latitude: 41.1200,
        longitude: 16.8700,
        xpReward: 150,
      },

      // Segreti
      {
        name: "Vicolo Stretto",
        description: "Uno dei vicoli più stretti d'Italia, nascosto nel cuore di Bari Vecchia",
        category: "Segreto",
        latitude: 41.1368,
        longitude: 16.8758,
        xpReward: 300,
      },
      {
        name: "Grotta della Madonna",
        description: "Grotta naturale con storia affascinante nella Bari Vecchia",
        category: "Segreto",
        latitude: 41.1355,
        longitude: 16.8745,
        xpReward: 280,
      },
      {
        name: "Orto Botanico",
        description: "Giardino botanico segreto con piante rare e affascinanti",
        category: "Segreto",
        latitude: 41.1245,
        longitude: 16.8695,
        xpReward: 250,
      },
      {
        name: "Terrazza Nascosta",
        description: "Terrazza panoramica segreta con vista spettacolare sulla città",
        category: "Segreto",
        latitude: 41.1320,
        longitude: 16.8670,
        xpReward: 320,
      },
      {
        name: "Museo Sotterraneo",
        description: "Museo nascosto negli scantinati della Bari Vecchia",
        category: "Segreto",
        latitude: 41.1365,
        longitude: 16.8751,
        xpReward: 290,
      },

      // Più POI
      {
        name: "Molo Sant'Antonio",
        description: "Porto storico con vista sul mare e sui pescherecci",
        category: "Cultura",
        latitude: 41.1340,
        longitude: 16.8680,
        xpReward: 110,
      },
      {
        name: "Piazza Mercantile",
        description: "Piazza storica nel cuore della città vecchia",
        category: "Cultura",
        latitude: 41.1360,
        longitude: 16.8755,
        xpReward: 100,
      },
      {
        name: "Strada delle Orecchiette",
        description: "Via storica dove le donne preparano le orecchiette a mano",
        category: "Food",
        latitude: 41.1365,
        longitude: 16.8760,
        xpReward: 75,
      },
      {
        name: "Porto di Bari",
        description: "Porto commerciale e turistico con vista panoramica",
        category: "Natura",
        latitude: 41.1310,
        longitude: 16.8650,
        xpReward: 85,
      },
      {
        name: "Bari Nuova - Corso Cavour",
        description: "Corso principale della città moderna con negozi e caffè",
        category: "Cultura",
        latitude: 41.1250,
        longitude: 16.8680,
        xpReward: 60,
      },
      {
        name: "Parco Muraglia",
        description: "Parco costiero con sentieri panoramici e aree relax",
        category: "Natura",
        latitude: 41.1290,
        longitude: 16.8610,
        xpReward: 95,
      },
      {
        name: "Biblioteca Nazionale Sagarriga Visconti",
        description: "Biblioteca storica con collezioni rare e preziose",
        category: "Cultura",
        latitude: 41.1200,
        longitude: 16.8750,
        xpReward: 80,
      },
      {
        name: "Università di Bari",
        description: "Ateneo storico con architettura affascinante",
        category: "Cultura",
        latitude: 41.1150,
        longitude: 16.8800,
        xpReward: 70,
      },
      {
        name: "Muraglia di Bari",
        description: "Antica muraglia difensiva con vista sul mare",
        category: "Segreto",
        latitude: 41.1340,
        longitude: 16.8620,
        xpReward: 260,
      },
      {
        name: "Fontana del Cavallo",
        description: "Fontana storica nel centro della città",
        category: "Cultura",
        latitude: 41.1270,
        longitude: 16.8700,
        xpReward: 65,
      },
    ];

    const poiIds = [];
    for (const poi of pois) {
      const [result] = await connection.execute(
        "INSERT INTO poi (name, description, category, latitude, longitude, xpReward) VALUES (?, ?, ?, ?, ?, ?)",
        [poi.name, poi.description, poi.category, poi.latitude, poi.longitude, poi.xpReward]
      );
      poiIds.push(result.insertId);
    }
    console.log(`✅ ${pois.length} POI creati\n`);

    // 3. Seed Tours
    console.log("🎫 Creazione tour disponibili...");
    const tours = [
      {
        name: "Tour Bari Vecchia",
        description: "Scopri i segreti della Bari Vecchia con una guida esperta",
        price: 25.0,
        duration: 120,
        maxParticipants: 15,
        partnerId: partnerIds[0],
      },
      {
        name: "Tour Gastronomico",
        description: "Assaggia i piatti tipici di Bari con degustazione inclusa",
        price: 45.0,
        duration: 180,
        maxParticipants: 10,
        partnerId: partnerIds[0],
      },
      {
        name: "Tour Culturale Basilica",
        description: "Visita guidata alla Basilica di San Nicola e alla Cattedrale",
        price: 20.0,
        duration: 90,
        maxParticipants: 20,
        partnerId: partnerIds[0],
      },
      {
        name: "Tour Sunset sul Lungomare",
        description: "Passeggiata al tramonto sul lungomare di Bari",
        price: 15.0,
        duration: 60,
        maxParticipants: 25,
        partnerId: partnerIds[1],
      },
      {
        name: "Tour Fotografico",
        description: "Scopri i migliori angoli di Bari per fotografie spettacolari",
        price: 30.0,
        duration: 150,
        maxParticipants: 12,
        partnerId: partnerIds[2],
      },
      {
        name: "Tour Spiagge Nascoste",
        description: "Visita le spiagge più belle e meno conosciute di Bari",
        price: 35.0,
        duration: 180,
        maxParticipants: 15,
        partnerId: partnerIds[3],
      },
      {
        name: "Tour Street Food",
        description: "Degustazione di street food barese nei migliori punti della città",
        price: 28.0,
        duration: 120,
        maxParticipants: 18,
        partnerId: partnerIds[4],
      },
      {
        name: "Tour Notturno",
        description: "Esplora Bari di notte con le sue luci e atmosfere affascinanti",
        price: 22.0,
        duration: 100,
        maxParticipants: 20,
        partnerId: partnerIds[0],
      },
      {
        name: "Tour Castello Normanno-Svevo",
        description: "Visita guidata al Castello con storia e curiosità affascinanti",
        price: 18.0,
        duration: 75,
        maxParticipants: 25,
        partnerId: partnerIds[1],
      },
      {
        name: "Tour Fiera del Levante",
        description: "Scopri la storia e l'importanza della Fiera del Levante",
        price: 16.0,
        duration: 90,
        maxParticipants: 30,
        partnerId: partnerIds[2],
      },
    ];

    const tourIds = [];
    for (const tour of tours) {
      const [result] = await connection.execute(
        "INSERT INTO tours (partnerId, title, description, price, duration, maxParticipants, active) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [tour.partnerId, tour.name, tour.description, tour.price, tour.duration, tour.maxParticipants, true]
      );
      tourIds.push(result.insertId);
    }
    console.log(`✅ ${tours.length} tour creati\n`);

    // 4. Seed Coupons
    console.log("🎁 Creazione coupon...");
    const coupons = [
      {
        code: "BARI10",
        description: "10% di sconto su tutti i piatti",
        discount: 10,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[0],
      },
      {
        code: "GELATO5",
        description: "5€ di sconto sul gelato artigianale",
        discount: 5,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[1],
      },
      {
        code: "MODA20",
        description: "20% di sconto su tutta la collezione",
        discount: 20,
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[2],
      },
      {
        code: "CAFFE2",
        description: "Caffè gratis con acquisto di 2 cornetti",
        discount: 2,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[3],
      },
      {
        code: "LIBRO15",
        description: "15% di sconto su libri selezionati",
        discount: 15,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[4],
      },
      {
        code: "BARIVECCHIA25",
        description: "25% di sconto per cena in gruppo",
        discount: 25,
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[0],
      },
      {
        code: "ESTATE30",
        description: "30% di sconto su gelato e granite",
        discount: 30,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[1],
      },
      {
        code: "SHOPPING12",
        description: "12€ di sconto su acquisti sopra 50€",
        discount: 12,
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[2],
      },
      {
        code: "COLAZIONE3",
        description: "3€ di sconto sulla colazione",
        discount: 3,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[3],
      },
      {
        code: "CULTURA8",
        description: "8€ di sconto su libri di storia e cultura",
        discount: 8,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[4],
      },
      {
        code: "BEEHUNTER50",
        description: "50% di sconto su primo acquisto",
        discount: 50,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[0],
      },
      {
        code: "SUMMER15",
        description: "15% di sconto su tutte le categorie",
        discount: 15,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[1],
      },
      {
        code: "WEEKEND18",
        description: "18% di sconto nel fine settimana",
        discount: 18,
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[2],
      },
      {
        code: "LOYALTY7",
        description: "7€ di sconto per clienti fedeli",
        discount: 7,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[3],
      },
      {
        code: "SPECIAL22",
        description: "22% di sconto su articoli in promozione",
        discount: 22,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        partnerId: partnerIds[4],
      },
    ];

    for (const coupon of coupons) {
      await connection.execute(
        "INSERT INTO coupon (partnerId, code, title, description, discount, expiresAt, active) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [coupon.partnerId, coupon.code, coupon.code, coupon.description, coupon.discount.toString(), coupon.expiresAt, true]
      );
    }
    console.log(`✅ ${coupons.length} coupon creati\n`);

    console.log("🎉 Seed completato con successo!");
    console.log(`
📊 Riepilogo:
  - ${partners.length} partner commerciali
  - ${pois.length} punti di interesse (POI)
  - ${tours.length} tour disponibili
  - ${coupons.length} coupon attivi
    `);
  } catch (error) {
    console.error("❌ Errore durante il seed:", error);
    throw error;
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedDatabase().catch(console.error);

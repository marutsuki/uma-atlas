-- AlterTable
ALTER TABLE "Legacy" ADD COLUMN     "umaMusumeId" TEXT;

-- CreateTable
CREATE TABLE "UmaMusume" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayImageUrl" TEXT NOT NULL,

    CONSTRAINT "UmaMusume_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Legacy" ADD CONSTRAINT "Legacy_umaMusumeId_fkey" FOREIGN KEY ("umaMusumeId") REFERENCES "UmaMusume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "UmaMusume" 
("id", "key", "name", "displayImageUrl") 
VALUES
-- TODO: These image urls need to be updated
('umamusume0', 'SPECIAL_WEEK', 'Special Week', 'https://umamusume-images.com/special_week.jpg'),
('umamusume1', 'SILENCE_SUZUKA', 'Silence Suzuka', 'https://umamusume-images.com/silence_suzuka.jpg'),
('umamusume2', 'TOUKAI_TEIO', 'Toukai Teio', 'https://umamusume-images.com/toukai_teio.jpg'),
('umamusume3', 'MARUZENSKY', 'Maruzensky', 'https://umamusume-images.com/maruzensky.jpg'),
('umamusume4', 'OGURI_CAP', 'Oguri Cap', 'https://umamusume-images.com/oguri_cap.jpg'),
('umamusume5', 'VODKA', 'Vodka', 'https://umamusume-images.com/vodka.jpg'),
('umamusume6', 'DAIWA_SCARLET', 'Daiwa Scarlet', 'https://umamusume-images.com/daiwa_scarlet.jpg'),
('umamusume7', 'GOLD_SHIP', 'Gold Ship', 'https://umamusume-images.com/gold_ship.jpg'),
('umamusume8', 'MEJIRO_MCQUEEN', 'Mejiro McQueen', 'https://umamusume-images.com/mejiro_mcqueen.jpg'),
('umamusume9', 'SYMBOL_I_RISTO', 'Symboli Rudolf', 'https://umamusume-images.com/symbol_i_risto.jpg'), -- Assuming "Symboli Rudolf"
('umamusume10', 'RICE_SHOWER', 'Rice Shower', 'https://umamusume-images.com/rice_shower.jpg'),
('umamusume11', 'MIHARA_BOKU', 'Mihara Boku', 'https://umamusume-images.com/mihara_boku.jpg'),
('umamusume12', 'FINE_MOTION', 'Fine Motion', 'https://umamusume-images.com/fine_motion.jpg'),
('umamusume13', 'KAWAKAMI_PRINCESS', 'Kawakami Princess', 'https://umamusume-images.com/kawakami_princess.jpg'),
('umamusume14', 'MANHATTAN_CAFE', 'Manhattan Cafe', 'https://umamusume-images.com/manhattan_cafe.jpg'),
('umamusume15', 'AIR_GROOVE', 'Air Groove', 'https://umamusume-images.com/air_groove.jpg'),
('umamusume16', 'SEIUN_SKY', 'Seiun Sky', 'https://umamusume-images.com/seiun_sky.jpg'),
('umamusume17', 'EL_CONDOR_PASA', 'El Condor Pasa', 'https://umamusume-images.com/el_condor_pasa.jpg'),
('umamusume18', 'TM_OPERA_O', 'TM Opera O', 'https://umamusume-images.com/tm_opera_o.jpg'),
('umamusume19', 'NARITA_BRIAN', 'Narita Brian', 'https://umamusume-images.com/narita_brian.jpg'),
('umamusume20', 'MIHAL_TOUDA', 'Mihal Touda', 'https://umamusume-images.com/mihal_touda.jpg'),
('umamusume21', 'GRASS_WONDER', 'Grass Wonder', 'https://umamusume-images.com/grass_wonder.jpg'),
('umamusume22', 'HISHI_AMAZON', 'Hishi Amazon', 'https://umamusume-images.com/hishi_amazon.jpg'),
('umamusume23', 'FALCON', 'Falcon', 'https://umamusume-images.com/falcon.jpg'),
('umamusume24', 'BIWA_HAYAHIDE', 'Biwa Hayahide', 'https://umamusume-images.com/biwa_hayahide.jpg');
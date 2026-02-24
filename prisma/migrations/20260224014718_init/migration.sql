-- CreateTable
CREATE TABLE "lineages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "persons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lineage_id" INTEGER NOT NULL,
    "ho" TEXT,
    "ten_dem" TEXT,
    "ten" TEXT NOT NULL,
    "ten_thuong_goi" TEXT,
    "ten_huy" TEXT,
    "ten_thuy" TEXT,
    "ten_hieu" TEXT,
    "han_nom_name" TEXT,
    "gender" TEXT,
    "is_alive" BOOLEAN NOT NULL DEFAULT true,
    "generation_number" INTEGER,
    "branch_id" INTEGER,
    "biography" TEXT,
    "avatar" TEXT,
    "birth_date_json" TEXT,
    "death_date_json" TEXT,
    "birth_place" TEXT,
    "death_place" TEXT,
    "burial_place" TEXT,
    "burial_latitude" REAL,
    "burial_longitude" REAL,
    "cover_photo" TEXT,
    "privacy_level" INTEGER,
    "birth_order" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "persons_lineage_id_fkey" FOREIGN KEY ("lineage_id") REFERENCES "lineages" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "relationships" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "from_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,
    "rel_type" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "relationships_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "relationships_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lineage_id" INTEGER NOT NULL,
    "title" TEXT,
    "event_type" TEXT NOT NULL,
    "event_subtype" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "location" TEXT,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence_type" TEXT,
    "reminder_enabled" BOOLEAN NOT NULL DEFAULT false,
    "reminder_days_before" INTEGER,
    "privacy_level" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "events_lineage_id_fkey" FOREIGN KEY ("lineage_id") REFERENCES "lineages" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

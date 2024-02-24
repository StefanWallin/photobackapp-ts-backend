/*
  Warnings:

  - You are about to drop the column `deviceId` on the `AuthAttempt` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuthAttempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileId" INTEGER NOT NULL,
    "secret" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AuthAttempt_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AuthAttempt" ("createdAt", "expiresAt", "id", "profileId", "secret", "updatedAt") SELECT "createdAt", "expiresAt", "id", "profileId", "secret", "updatedAt" FROM "AuthAttempt";
DROP TABLE "AuthAttempt";
ALTER TABLE "new_AuthAttempt" RENAME TO "AuthAttempt";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

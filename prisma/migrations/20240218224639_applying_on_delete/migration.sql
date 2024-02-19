-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_urlId_fkey";

-- DropForeignKey
ALTER TABLE "Url" DROP CONSTRAINT "Url_userId_fkey";

-- CreateIndex
CREATE INDEX "Url_shortUrl_idx" ON "Url"("shortUrl");

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE CASCADE ON UPDATE CASCADE;

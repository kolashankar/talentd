import { db } from "./database";
import { jobs, articles } from "@shared/schema";
import { lt } from "drizzle-orm";

export async function cleanupExpiredContent() {
  try {
    const now = new Date();
    
    const deletedJobs = await db
      .delete(jobs)
      .where(lt(jobs.expiresAt, now))
      .returning();
    
    const deletedArticles = await db
      .delete(articles)
      .where(lt(articles.expiresAt, now))
      .returning();
    
    if (deletedJobs.length > 0 || deletedArticles.length > 0) {
      console.log(`[Cleanup] Deleted ${deletedJobs.length} expired jobs and ${deletedArticles.length} expired articles`);
    }
    
    return {
      deletedJobs: deletedJobs.length,
      deletedArticles: deletedArticles.length,
    };
  } catch (error) {
    console.error('[Cleanup] Error cleaning up expired content:', error);
    return {
      deletedJobs: 0,
      deletedArticles: 0,
    };
  }
}

export function startCleanupScheduler() {
  const ONE_HOUR = 60 * 60 * 1000;
  
  console.log('[Cleanup] Starting cleanup scheduler (runs every hour)');
  
  cleanupExpiredContent();
  
  setInterval(() => {
    cleanupExpiredContent();
  }, ONE_HOUR);
}

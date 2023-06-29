import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const session = await getAuthSession();
  let followedCommunitiesIds: string[] = [];

  if (session?.user) {
    const followedCommunities = await db.subscription.findMany({
      where: { userId: session.user.id },
      include: {
        subreddit: true,
      },
    });
    followedCommunitiesIds = followedCommunities.map(({subreddit}) => subreddit.id);
  }

  try {
    const {limit, page, subredditName}  = z.object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional()
    }).parse({
        subredditName: url.searchParams.get('subredditName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page')
    })

    let whereClause = {}

    if (subredditName) {
        whereClause = {
            subreddit: subredditName
        }
    } else if (session) {
        whereClause = {
            id: {
                in: followedCommunitiesIds
            }
        }
    }
  } catch (error) {
    
  }

}

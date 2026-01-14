import { Client } from '@notionhq/client';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const databaseId = process.env.NOTION_DATABASE_ID || '2599a3c647cf43b1926517099437fae5';

    // Query the database for all test plans
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Name',
        title: {
          contains: '[Test Plan]'
        }
      },
      sorts: [
        {
          property: 'Last edited time',
          direction: 'descending'
        }
      ]
    });

    // Transform Notion pages to our project format
    const projects = response.results.map((page, index) => {
      const props = page.properties;

      // Extract title
      const titleProp = props.Name || props.name || props.title;
      const title = titleProp?.title?.[0]?.plain_text || 'Untitled';

      // Extract status
      const statusProp = props.Status || props.status;
      let status = 'active';
      if (statusProp?.select?.name) {
        const statusName = statusProp.select.name.toLowerCase();
        if (statusName.includes('complete') || statusName.includes('done')) {
          status = 'completed';
        } else if (statusName.includes('draft') || statusName.includes('planning')) {
          status = 'draft';
        }
      }

      // Extract team/owner
      const teamProp = props.Team || props.Owner || props.team;
      const team = teamProp?.select?.name || teamProp?.rich_text?.[0]?.plain_text || 'Unknown Team';

      // Extract dates
      const created = page.created_time ? new Date(page.created_time).toLocaleDateString() : 'Unknown';
      const lastEdited = page.last_edited_time ? new Date(page.last_edited_time).toLocaleDateString() : 'Unknown';

      return {
        id: page.id,
        notionId: page.id,
        notionUrl: page.url,
        name: title.replace('[Test Plan] ', '').replace('[Test Plan]', '').trim(),
        description: title,
        status,
        owner: { name: 'Synced from Notion', avatar: 'N' },
        isYours: false, // Default to false, can be updated based on ownership logic
        team,
        lastUpdated: lastEdited,
        created,
        documents: {
          prd: { name: 'View in Notion', link: page.url },
          techSpec: null,
          linearProject: null
        },
        figmaLink: '',
        slackChannel: '',
        splitFlag: '',
        starred: false,
        stats: {
          totalTestCases: 0,
          ios: { pass: 0, incomplete: 0 },
          android: { pass: 0, incomplete: 0 },
          analytics: { total: 0, pass: 0, incomplete: 0 }
        }
      };
    });

    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error('Notion sync error:', error);
    res.status(500).json({
      error: 'Failed to sync with Notion',
      message: error.message
    });
  }
}

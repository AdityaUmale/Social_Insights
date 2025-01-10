import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
   
    const body = await request.json();
    const { input_value } = body;


    if (!input_value) {
      return NextResponse.json({ error: 'Input value is required' }, { status: 400 });
    }

    const data = JSON.stringify({
      input_value,
      output_type: 'chat',
      input_type: 'chat',
      tweaks: {},
    });

  
    const apiToken = process.env.LANGFLOW_API_TOKEN;

    if (!apiToken) {
      return NextResponse.json({ error: 'API token is not configured' }, { status: 500 });
    }

    
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.langflow.astra.datastax.com/lf/17d1eb42-e464-455f-abda-5a6512443d83/api/v1/run/d24ef225-5048-48c0-9844-eed2c5333451?stream=false',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
      data,
    };

   
    const response = await axios.request(config);
    const result = response.data;

    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calling LangFlow API:', error);
    return NextResponse.json({ error: 'Failed to fetch data from LangFlow API' }, { status: 500 });
  }
}

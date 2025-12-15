import { NextResponse } from 'next/server';

export async function GET() {
  const suggestedCreators = [
    {
      id: 'c1',
      name: 'Alexander Hipp',
      avatar: 'https://i.pravatar.cc/300?u=alexander.hipp',
      platform: 'Instagram',
      followers: '120K',
      reach: '1.2M/mo',
      engRate: '4.2%',
    },
    {
      id: 'c2',
      name: 'Maya Chen',
      avatar: 'https://i.pravatar.cc/300?u=maya.chen',
      platform: 'YouTube',
      followers: '85K',
      reach: '500K/mo',
      engRate: '3.1%',
    },
    {
      id: 'c3',
      name: 'Rufus',
      avatar: 'https://i.pravatar.cc/300?u=rufus',
      platform: 'TikTok',
      followers: '200K',
      reach: '2.3M/mo',
      engRate: '5.6%',
    },
    {
      id: 'c4',
      name: 'Christina Perry',
      avatar: 'https://i.pravatar.cc/300?u=christina.perry',
      platform: 'Instagram',
      followers: '95K',
      reach: '700K/mo',
      engRate: '3.9%',
    },
    {
      id: 'c5',
      name: 'John Black',
      avatar: 'https://i.pravatar.cc/300?u=john.black',
      platform: 'YouTube',
      followers: '70K',
      reach: '340K/mo',
      engRate: '2.8%',
    },
    {
      id: 'c6',
      name: 'John Black',
      avatar: 'https://i.pravatar.cc/300?u=john.black',
      platform: 'YouTube',
      followers: '70K',
      reach: '340K/mo',
      engRate: '2.8%',
    },
    {
      id: 'c7',
      name: 'John Black',
      avatar: 'https://i.pravatar.cc/300?u=john.black',
      platform: 'YouTube',
      followers: '70K',
      reach: '340K/mo',
      engRate: '2.8%',
    },
  ];

  const campaignCreators = [
    { id: 'r1', name: 'Rufus', avatar: 'https://i.pravatar.cc/300?u=rufus.campaign', status: 'Accepted' },
    { id: 'r2', name: 'Christina Perry', avatar: 'https://i.pravatar.cc/300?u=christina.campaign', status: 'Refining' },
    { id: 'r3', name: 'John Black', avatar: 'https://i.pravatar.cc/300?u=john.campaign', status: 'Declined' },
    { id: 'r4', name: 'John Black', avatar: 'https://i.pravatar.cc/300?u=john.campaign', status: 'Declined' },
    { id: 'r5', name: 'John Black', avatar: 'https://i.pravatar.cc/300?u=john.campaign', status: 'Declined' },
    { id: 'r6', name: 'John Black', avatar: 'https://i.pravatar.cc/300?u=john.campaign', status: 'Declined' },
  ];

  return NextResponse.json({ suggestedCreators, campaignCreators });
}

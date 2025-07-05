import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface StreakDay {
    date: string;
    active: boolean;
}

export function StreakSummary() {
    const streakData: StreakDay[] = [
        {
            date: "2025-02-19",
            active: true,
        },
        {
            date: "2025-02-20",
            active: true,
        },
        {
            date: "2025-02-21",
            active: true,
        },
        {
            date: "2025-02-22",
            active: true,
        }
    ];

    // Reverse the array to display latest date at the bottom
    const reversedStreakData = [...streakData].reverse();

    const currentStreak = streakData.findIndex(day => !day.active);
    const streakCount = currentStreak === -1 ? streakData.length : currentStreak;

    return (
        <Card className="col-span-1">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        Current Streak
                    </CardTitle>
                    <span className="text-2xl font-bold text-orange-500">{streakCount} days</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative ml-4">
                    {reversedStreakData.map((day, index) => (
                        <div key={day.date} className="flex mb-6 relative">
                            {/* Vertical line */}
                            {index !== reversedStreakData.length - 1 && (
                                <div className={`absolute left-3 top-6 w-0.5 h-full -ml-3 ${day.active ? 'bg-orange-500' : 'bg-gray-200'}`} />
                            )}

                            {/* Circle indicator */}
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                ${day.active
                                    ? 'border-orange-500 bg-orange-100'
                                    : 'border-gray-200 bg-gray-50'}`}>
                                {day.active && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                            </div>

                            {/* Content */}
                            <div className="ml-4">
                                <p className="text-sm font-medium">
                                    {new Date(day.date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default StreakSummary;
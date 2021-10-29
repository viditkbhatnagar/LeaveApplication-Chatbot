module.exports ={
    confirmLeave: (leaveType,leaveDays,leaveDate) =>{
        return {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.3",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "Container",
                            "items": [
                                {
                                    "type": "ColumnSet",
                                    "columns": [
                                        {
                                            "type": "Column",
                                            "width": "stretch",
                                            "items": [
                                                {
                                                    "type": "Image",
                                                    "url": "https://tse3.mm.bing.net/th?id=OIP.YoLfOD_PaqULt3rr4Ox0QwHaDD&pid=Api&P=0&w=379&h=157",
                                                    "size": "Medium",
                                                    "horizontalAlignment": "Left"
                                                }
                                            ]
                                        },
                                        {
                                            "type": "Column",
                                            "width": "stretch",
                                            "items": [
                                                {
                                                    "type": "TextBlock",
                                                    "text": "Leave Application",
                                                    "wrap": true,
                                                    "size": "Medium",
                                                    "weight": "Bolder",
                                                    "color": "Accent"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "separator": true,
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Type of Leave",
                                    "wrap": true,
                                    "horizontalAlignment": "Left",
                                    "weight": "Bolder"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `${leaveType}`,
                                    "wrap": true,
                                    "horizontalAlignment": "Left"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Number Days",
                                    "wrap": true,
                                    "weight": "Bolder"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `${leaveDays}`,
                                    "wrap": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Leave Date",
                                    "wrap": true,
                                    "weight": "Bolder"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `${leaveDate}`,
                                    "wrap": true
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "TextBlock",
                    "wrap": true,
                    "text": "I Have applied  for the leave application with above details to know the status please type \"Leave Status\"",
                    "size": "Default",
                    "weight": "Bolder",
                    "color": "Accent"
                }
            ]
        }
    },
    
    

}
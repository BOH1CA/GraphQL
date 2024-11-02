async function getJwtToken() {
    const jwToken = localStorage.getItem('jwToken');
    if (!jwToken) {
        throw new Error('JWT token not found. Please log in.');
    }
    return jwToken;
}

async function fetchGraphQLData(query, token) {
    const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.errors?.[0]?.message || 'Network response was not ok';
        throw new Error(errorMessage);
    }

    return await response.json();
}

function extractUserData(responseData) {
    const user = responseData?.data?.user?.[0];
    if (!user) {
        throw new Error('User data not found in response');
    }
    return user;
}

export async function retriveData() {
    try {
        const jwToken = await getJwtToken();
        const query = `
                    query {
                        user {
                        login
                        auditRatio
                        totalUp
                        totalDown
                        audits_aggregate (
                            where:{grade:{_neq:0}}){
                            aggregate {
                                count
                            }
                        }
                        attrs
                        transactions(
                            order_by: [{ type: asc }, { amount: asc }]
                            distinct_on: [type]
                            where: { type: { _like: "skill_%" }}
                        )   { 
                            type
                            amount
                        }
                        xps(
                            where: { path: { _nregex: "piscine-(go|js)" } }
                            order_by: { amount: asc }
                        )   {
                            amount
                            path
                            }
                        progresses(
                            order_by: { createdAt: asc }
                            where: { path: { _nregex: "piscine-(go|js)" } }
                        )   {
                            createdAt
                            path
                            }
                        }
                    }
                `;
      
        const responseData = await fetchGraphQLData(query, jwToken);
        // Extract user data
        const userData = responseData.data?.user?.[0];
        if (!userData) {
            throw new Error('User data not found in response');
        }
        const transactionsData = responseData.data.transaction || [];
        const xpProgressData = responseData.data.xpProgress || [];
        const projectsData = responseData.data.projectsLowtoHighXp || [];

        return { userData, transactionsData, xpProgressData, projectsData };
        
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        throw error;
    }
}







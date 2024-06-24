import React from 'react';
import Login from '../pages/Login';
import useAuth from "../pages/currentUser";
import Spinner from '../components/Spinner';
import MembershipTypesBarChart from './MembershipTypesBarChart';
import DemographyLineGraph from './DemographyLineGraph';
import Genderpiechart from './GenderPieChart';  
import UsersData from './UsersData'; 


const Overall = () => {
    const { currentUser, firebaseInitialized } = useAuth();

    if (!firebaseInitialized) {
        return( 
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}> 
                <Spinner /> 
            </div>
        )
      } 

    return(
        <div>
            {!currentUser ? (
                <div><Login /></div>
            ) : (
                <div>
                    <div>
                        < UsersData />
                        <h3 style={{marginTop:'10px'}}>The following statistics represent both: the Memberships' current 
                            statistics and the Gender percentage:
                        </h3>
                        <div style={{ display: 'flex', gap: '16px' }}> 
                            < MembershipTypesBarChart />
                            < Genderpiechart />
                        </div>
                        <h3 style={{marginTop:'10px'}}>The following line graph demonstrates the number of people accessing
                            the gym daily:
                        </h3>
                        < DemographyLineGraph />
                    </div>
                </div>
            )}
        </div>
    )
}
export default Overall
import React, { useEffect } from 'react';
import axios from 'axios';
import { Patient } from '../types';
import { useParams } from 'react-router';
import { useStateValue, setPatientView } from '../state/';
import { Icon } from 'semantic-ui-react';

const ShowPatient = () => {

    const { id } = useParams<{ id: string }>();
    const [state, dispatch] = useStateValue();

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const { data: patient } = await axios.get<Patient>(`http://localhost:3001/api/patients/${id}`);
                dispatch(setPatientView(patient));
            } catch (e) {
                console.error(e);
            }
        };
        if (state.patient.id !== id) {
            void fetchPatientData();
        }
    }, [state.patient.id]);

    const SetGenderIcon = () => {
        if (state.patient.gender === 'male') {
            return <Icon className='mars' />;
        } else if (state.patient.gender === 'female') {
            return <Icon className='venus' />;
        } else {
            return <Icon className='genderless' />;
        }
    };

    if (!state.patient) {
        return (
            <h1>loading...</h1>
        );
    }

    const patientEntries = state.patient.entries ? state.patient.entries : [];

    const findDiagnosisName = (code: string): string | undefined => {
        const found = state.diagnoses.find(c => c.code === code);
        return found ? found.name : '';
    };

    return (
        <div>
            <h1>{state.patient.name} {SetGenderIcon()} </h1>
            <p>
                {state.patient.ssn} <br />
                {state.patient.occupation}
            </p>
            <div>
                <h3>entries</h3>
                {
                    patientEntries.map(e => {

                        return <>
                            {e.date} {e.description} <br />
                            {e.diagnosisCodes ?
                                <ul>
                                    {e.diagnosisCodes.map(c => <li key={c}> {c} {findDiagnosisName(c)} </li>)}
                                </ul>
                                : null}
                        </>;
                    })
                }
            </div>
        </div>
    );
};

export default ShowPatient;
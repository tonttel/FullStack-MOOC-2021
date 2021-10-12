import React, { useEffect } from 'react';
import axios from 'axios';
import { Entry, Patient, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry } from '../types';
import { useParams } from 'react-router';
import { useStateValue, setPatientView } from '../state/';
import { Icon } from 'semantic-ui-react';

const borderStyle = {
    padding: '10px',
    border: '2px solid black',
    borderRadius: '5px',
    marginTop: '5px',
    marginBottom: '5px'
};

const HospitalEntryComponent = ({ props }: { props: HospitalEntry }) => {
    return <div style={borderStyle}>
        {props.date} <Icon className='hospital symbol' /> <br />
        Visit type: {props.type} <br />
        Description: {props.description} <br />
        Discharge date: {props.discharge.date} <br />
        Discharge criteria: {props.discharge.criteria} <br />
        {mapDiagnosesToComponent(props)}
    </div>;
};


const OccupationalHealthcareComponent = ({ props }: { props: OccupationalHealthcareEntry }) => {
    return (
        <div style={borderStyle}>
            {props.date} <Icon className='doctor' /> <strong>{props.employerName}</strong> <br />
            Visit type: {props.type} <br />
            Description: {props.description}
            {mapDiagnosesToComponent(props)}
        </div>
    );
};


const HealthCheckEntryComponent = ({ props }: { props: HealthCheckEntry }) => {
    let rateVisit;

    if (props.healthCheckRating === 0) {
        rateVisit = <Icon color='green' className='heart outline' />;
    } else if (props.healthCheckRating <= 3) {
        rateVisit = <Icon color='yellow' className='heart outline' />;
    } else {
        rateVisit = <Icon color='red' className='heart outline' />;
    }

    return (
        <div style={borderStyle}>
            {props.date} <Icon className='heart' /><br />
            Visit type: {props.type} <br />
            Description: {props.description}
            {mapDiagnosesToComponent(props)}
            rate: {rateVisit}
        </div>
    );
};

const mapDiagnosesToComponent = (props: Entry) => {
    return (
        <>
            <ul>
                {props.diagnosisCodes ? props.diagnosisCodes.map((c: string) => <li key={c}> {c} {findDiagnosisName(c)}</li>) : null}
            </ul>
        </>
    );
};

const findDiagnosisName = (code: string): string => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [state, dispatch] = useStateValue();
    const found = state.diagnoses.find(c => c.code === code);
    return found ? found.name : '';
};

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

    const patientEntries = state.patient.entries ? state.patient.entries : [];

    const SetGenderIcon = () => {
        if (state.patient.gender === 'male') {
            return <Icon className='mars' />;
        } else if (state.patient.gender === 'female') {
            return <Icon className='venus' />;
        } else {
            return <Icon className='genderless' />;
        }
    };

    const assertNever = (value: never): never => {
        throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
    };

    const EntryDetails = (entry: Entry) => {
        switch (entry.type) {
            case 'Hospital':
                return <HospitalEntryComponent props={entry} />;
            case 'OccupationalHealthcare':
                return <OccupationalHealthcareComponent props={entry} />;
            case 'HealthCheck':
                return <HealthCheckEntryComponent props={entry} />;
            default:
                return assertNever(entry);
        }
    };

    if (!state.patient) {
        return (
            <h1>loading...</h1>
        );
    }

    return (
        <div>
            <h1>{state.patient.name} {SetGenderIcon()} </h1>
            <p>
                {state.patient.ssn} <br />
                {state.patient.occupation}
            </p>
            <div>
                <h3>entries</h3>
                {patientEntries.map(e => EntryDetails(e))}
            </div>
        </div>
    );
};

export default ShowPatient;
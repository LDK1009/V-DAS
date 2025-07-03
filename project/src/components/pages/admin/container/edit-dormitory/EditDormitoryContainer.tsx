import { useDormitoryStore } from '@/store/dormitory/dormitoryStore';
import { useEffect } from 'react';
import ChangeFloorButtonGroup from './ChangeFloorButtonGroup';
import FloorView from './FloorView';

const EditDormitory = () => {

    const { dormitoryData } = useDormitoryStore();

    useEffect(() => {
        console.log(dormitoryData);
    }, [dormitoryData]);

    return (
        <div>
            <ChangeFloorButtonGroup/>
            <FloorView/>
        </div>
    );
};

export default EditDormitory;
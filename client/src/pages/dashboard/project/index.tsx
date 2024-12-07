import DataTable from 'react-data-table-component';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const columns = [
    {
        name: 'Title',
        selector: row => row.title,
    },
    {
        name: 'Year',
        selector: row => row.year,
    },
];

const data = [
    {
        id: 1,
        title: 'Beetlejuice',
        year: '1988',
    },
    {
        id: 2,
        title: 'Ghostbusters',
        year: '1984',
    },
]


export default function Project() {


    const router = useNavigate()


    return (
        <section className='container mx-auto md:px-20 py-5 space-y-5'>
            <div className='flex justify-end'>
                <Button className='' onClick={() => router("/project/create-project")}>Create Project</Button>
            </div>
            <div className='border border-gray-300'>
                <DataTable
                    columns={columns}
                    data={data}
                />
            </div>
        </section>
    );
};
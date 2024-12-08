import DataTable from 'react-data-table-component';
import { Button } from '../../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../../components/ui/dialog';


const columns = [
    {
        name: 'Title',
        selector: (row: { title: string; }) => row.title,
    },
    {
        name: 'Year',
        selector: (row: { year: string; }) => row.year,
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


const ProjectStatus = () => {
    return (
        <div className='sm:px-20 py-5 space-y-4'>
            <div className='flex justify-end'>
                <Dialog>
                    <DialogTrigger>
                        <Button>Create Project Status</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Project Status</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable
                columns={columns}
                data={data}
                className='border border-gray-300'
            />
        </div>
    )
}

export default ProjectStatus

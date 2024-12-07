import React from 'react'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Helmet } from 'react-helmet'

const CreateProject = () => {
    return (
        <>

            <Helmet>
                <title>Create Project</title>
            </Helmet>

            <div className='md:px-20 py-5'>
                <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5'>
                    <div>
                        <Label htmlFor="create-project">Project Title</Label>
                        <Input type="text" id="create-project" placeholder="Please Enter Title" />
                    </div>
                    <div>
                        <Label htmlFor="create-project">Project Title</Label>
                        <Input type="text" id="create-project" placeholder="Please Enter Title" />
                    </div>

                </div>
            </div>
        </>
    )
}

export default CreateProject

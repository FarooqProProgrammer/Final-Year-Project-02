import React, { useState } from 'react'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Helmet } from 'react-helmet'
import { DatePickerDemo } from '../../../../components/ui/DatePickerDemo'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { ClassicEditor, Essentials, Paragraph, Bold, Italic } from 'ckeditor5'
import { FormatPainter } from 'ckeditor5-premium-features'

const CreateProject = () => {
  // State for CKEditor content
  const [editorContent, setEditorContent] = useState('<p>Hello from CKEditor 5 in React!</p>')

  const handleEditorChange = (event: any, editor: any) => {
    // Update the state with the content of the editor
    setEditorContent(editor.getData())
  }

  return (
    <>
      <Helmet>
        <title>Create Project</title>
      </Helmet>

      <div className='md:px-20 py-5'>
        <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5'>
          <div>
            <Label htmlFor="create-project" className="mb-2">Project Title</Label>
            <Input type="text" id="create-project" placeholder="Please Enter Title" />
          </div>
          <div className=''>
            <Label htmlFor="create-project" className='block mb-2'>Project Start Date</Label>
            <DatePickerDemo />
          </div>
          <div className=''>
            <Label htmlFor="create-project" className='block mb-2'>Project End Date</Label>
            <DatePickerDemo />
          </div>
          <div className=''>
            <Label htmlFor="create-project" className='block mb-2'>Project Status</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="create-Saverrity" className="mb-2">Project Saverrity</Label>
            <Input type="text" id="create-Saverrity" placeholder="Please Enter Saverrity" />
          </div>
          <div className=''>
            <Label htmlFor="create-project" className='block mb-2'>Project Assignee</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <CKEditor
              editor={ClassicEditor}
              data={editorContent}  // Set initial content
              config={{
                licenseKey: '<YOUR_LICENSE_KEY>', // Or 'GPL'.
                plugins: [Essentials, Paragraph, Bold, Italic, FormatPainter],
                toolbar: ['undo', 'redo', '|', 'bold', 'italic', '|', 'formatPainter'],
              }}
              onChange={handleEditorChange}  // Handle editor content change
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateProject

import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// const RootStyle = styled('div')(({ theme }) => ({
//   borderRadius: theme.shape.borderRadius,
//   maxHeight: '400px',
//   overflow: 'scroll',
//   border: `solid 1px ${theme.palette.grey[500_32]}`,
//   '& .ql-container.ql-snow': {
//     borderColor: 'transparent',
//     ...theme.typography.body1,
//     fontFamily: theme.typography.fontFamily,
//     textAlign: 'center'
//   },
//   '& .ql-editor': {
//     minHeight: 200,
//     textAlign: 'left',
//     '&.ql-blank::before': {
//       fontStyle: 'normal',
//       color: theme.palette.text.disabled
//     },
//     '& pre.ql-syntax': {
//       ...theme.typography.body2,
//       padding: theme.spacing(2),
//       borderRadius: theme.shape.borderRadius,
//       backgroundColor: theme.palette.grey[900]
//     },
//     '& .ql-header h3': {
//       textAlign: 'center',
//       margin: '1em 0',
//       color: '#000'
//     },
//     '.ql-toolbar .ql-snow': {
//       position: 'sticky',
//       top: '20px',
//       zIndex: '10000',
//       background: '#fff'
//     }
//   }
// }));

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    [{ table: ['column'] }],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  }
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'table'
];
// eslint-disable-next-line
const CustomToolbarQuill = ({ value, onChange }) => (
  <ReactQuill
    value={value}
    onChange={onChange}
    theme="snow"
    modules={modules}
    formats={formats}
    placeholder="Write something awesome..."
  />
);

export default CustomToolbarQuill;
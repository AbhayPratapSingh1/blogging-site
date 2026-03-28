import React, { useEffect, useCallback, useState } from 'react';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, Box, FormHelperText } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// upload image to API
import { uploadImageToAPI } from './uploadImageToAPI';
import { getAllTagsRequest } from '../../features/tagSlice';
import { getAllCategoryRequest } from '../../features/categorySlice';
import { addNewBlogRequest, updateBlogRequest, getSingleBlogRequest } from '../../features/blogSlice';
import { QuillEditor } from '../editor';
import ServerMessage from '../ServerMessage';
import { UploadSingleFile } from '../upload';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

BlogForm.propTypes = {
  isEdit: PropTypes.bool
};

export default function BlogForm({ isEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existingBlog = useSelector((state) => state.blogs.singleBlog);
  const allTags = useSelector((state) => state.tags.allTags);
  const allCategories = useSelector((state) => state.categories.allCategory);
  const serverMessage = useSelector((state) => state.app.message);
  const allTagsArray = allTags?.length > 0 ? allTags.map((value) => value.tagName) : [];
  const [image, setImage] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [imageErrorMessage, setImageErrorMessage] = useState('');

  const blogValidationSchema = yup.object({
    title: yup.string().required("Title can't be blank"),
    tags: yup.array().required("Tags can't be blank"),
    description: yup.string().required("Description can't be blank"),
    category: yup.string().required("Category can't be blank"),
    metaTitle: yup.string().required("Meta Title can't be blank"),
    metaDescription: yup.string().required("Meta Description can't be blank"),
    metaKeywords: yup.array().required("Meta Keywords can't be blank")
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: (isEdit && existingBlog?.title) || '',
      description: (isEdit && existingBlog?.description) || '',
      tags: (isEdit && existingBlog?.tags) || [],
      category: (isEdit && existingBlog?.category) || '',
      metaTitle: (isEdit && existingBlog?.metaTitle) || '',
      metaDescription: (isEdit && existingBlog?.metaDescription) || '',
      metaKeywords: (isEdit && existingBlog?.metaKeywords && existingBlog.metaKeywords.split(',')) || []
    },
    validationSchema: blogValidationSchema,
    // eslint-disable-next-line
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        setSubmitting(true);
        if (isEdit) {
          const { metaKeywords, ...all } = values;
          if (!imagePreview) {
            const sendData = {
              ...all,
              coverImage: existingBlog.coverImage,
              metaKeywords: metaKeywords.toString(),
              id
            };
            dispatch(updateBlogRequest(sendData));
          }
          if (imagePreview) {
            // eslint-disable-next-line
            const newCoverImage = await uploadImageToAPI(image);
            if (newCoverImage) {
              const sendData = {
                ...all,
                coverImage: newCoverImage,
                metaKeywords: metaKeywords.toString(),
                id
              };
              dispatch(updateBlogRequest(sendData));
            }
          }
        }
        if (!isEdit) {
          if (!imagePreview) {
            return setImageErrorMessage('Please Upload Image');
          }
          // eslint-disable-next-line
          const { metaKeywords, ...all } = values;
          const uploadedObj = await uploadImageToAPI(image);
          if (uploadedObj) {
            const sendData = {
              ...all,
              coverImage: uploadedObj,
              metaKeywords: metaKeywords.toString()
            };
            dispatch(addNewBlogRequest(sendData));
          }
        }
        setSubmitting(false);
        resetForm();
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const successAndRedirect = () => {
    navigate(PATH_DASHBOARD.blogs.all);
  };
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  // eslint-disable-next-line
  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
        setImagePreview('');
        return setImageErrorMessage('File format is incorrect.');
      }

      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview(reader.result);
        }
      };

      reader.readAsDataURL(file);
    }
  }, []);

  const selectCategory = (e) => {
    if (e.target.value === '-') {
      setFieldValue('category', '');
      return;
    }
    setFieldValue('category', e.target.value);
  };

  useEffect(() => {
    if (isEdit) {
      dispatch(getSingleBlogRequest(id));
    }
    dispatch(getAllCategoryRequest());
    dispatch(getAllTagsRequest());
  }, [dispatch, isEdit, id]);

  return (
    <>
      {serverMessage ? (
        <ServerMessage
          open={Boolean(serverMessage)}
          text={serverMessage}
          deleteText="OK"
          clickFunction={successAndRedirect}
        />
      ) : (
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Post Title"
                      {...getFieldProps('title')}
                      value={values.title}
                      error={Boolean(touched.title && errors.title)}
                      helperText={touched.title && errors.title}
                    />
                    <div>
                      <LabelStyle>Description</LabelStyle>
                      <QuillEditor
                        id="post-description"
                        value={values.description}
                        onChange={(val) => setFieldValue('description', val)}
                        error={Boolean(touched.description && errors.description)}
                      />
                      {touched.description && errors.description && (
                        <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                          {touched.description && errors.description}
                        </FormHelperText>
                      )}
                    </div>
                    {isEdit && existingBlog && existingBlog.coverImage && (
                      <Stack sx={{ position: 'relative', minHeight: '18rem' }} spacing={3}>
                        <Box>
                          <LabelStyle>Cover Image</LabelStyle>
                          <Box
                            component="img"
                            alt="existing blog preview"
                            src={existingBlog?.coverImage?.url}
                            sx={{
                              top: 8,
                              borderRadius: 1,
                              objectFit: 'cover',
                              position: 'absolute',
                              width: 'calc(100% - 16px)',
                              maxHeight: '16rem',
                              mt: 4
                            }}
                          />
                        </Box>
                      </Stack>
                    )}
                    <div>
                      <LabelStyle>{isEdit ? 'Add Image to replace existing Cover Image' : 'Cover Image'}</LabelStyle>
                      <UploadSingleFile
                        accept="image/png,image/jpg, image/jpeg"
                        file={imagePreview}
                        maxSize={1024 * 1024}
                        onDrop={handleDrop}
                        error={Boolean(imageErrorMessage && imageErrorMessage)}
                      />

                      <FormHelperText error sx={{ px: 2 }}>
                        {imageErrorMessage && imageErrorMessage}
                      </FormHelperText>
                    </div>
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      select
                      fullWidth
                      label="Select Category"
                      placeholder="Choose One Category"
                      value={values.category}
                      SelectProps={{ native: true }}
                      onChange={selectCategory}
                      error={Boolean(touched.category && errors.category)}
                      helperText={touched.category && errors.category}
                    >
                      <option value="-">Select Category</option>
                      {allCategories &&
                        allCategories.length > 0 &&
                        allCategories.map((option) => (
                          <option key={option.categoryName} value={option.categoryName}>
                            {option.categoryName}
                          </option>
                        ))}
                    </TextField>
                    <Autocomplete
                      id="options"
                      multiple
                      value={values.tags}
                      onChange={(event, newValue) => {
                        setFieldValue('tags', newValue);
                      }}
                      options={allTagsArray}
                      getOptionLabel={(option) => option}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip key={option} size="small" label={option} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => <TextField label="Tags" {...params} />}
                    />

                    <TextField fullWidth label="Meta title" {...getFieldProps('metaTitle')} />

                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      maxRows={5}
                      label="Meta description"
                      {...getFieldProps('metaDescription')}
                    />

                    <Autocomplete
                      freeSolo
                      id="options"
                      multiple
                      value={values.metaKeywords}
                      onChange={(event, newValue) => {
                        setFieldValue('metaKeywords', newValue);
                      }}
                      options={allTagsArray}
                      getOptionLabel={(option) => option}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip key={option} size="small" label={option} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => <TextField label="Meta Keywords" {...params} />}
                    />
                  </Stack>
                </Card>

                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                    Post
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      )}
    </>
  );
}











// {
//     url : "hhhhh",
//     public_id:""
// }
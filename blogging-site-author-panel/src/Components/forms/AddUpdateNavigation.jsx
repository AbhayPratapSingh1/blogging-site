import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addNewNavigationRequest,
    clearError,
    getAllNavigationRequest,
    singleNavigationRequest,
    updateNavigationRequest,
} from "../../features/navigationSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import * as yup from "yup";
import NotificationModal from "../../Components/modals/NotificationModal";
import { setMessage } from "../../features/appSlice";
import { FieldBox } from "../common/fieldBox";
import { singleSiteRequest } from "../../features/siteSlice";

export default function AddUpdateNavigation({ edit }) {
    const dispatch = useDispatch();
    const { siteId } = useParams();
    const { navId } = useParams();

    const navigate = useNavigate();
    const singleNav = useSelector((store) => store.navigation.singleNavigation);
    const singleSite = useSelector((store) => store.sites.singleSite);

    const errorMessage = useSelector((state) =>
        state.navigation.errorInNavigation
    );

    const successMessage = useSelector((state) => state.app.message);

    const submitFunction = async (value) => {
        const submitValue = { ...value, site: singleSite._id };
        if (edit) {
            const editedValue = { ...submitValue, id: navId };
            dispatch(updateNavigationRequest(editedValue));
            return;
        }
        dispatch(addNewNavigationRequest(submitValue));
    };

    const initialValues = {
        name: edit ? singleNav?.name : "",
        link: edit ? singleNav?.link : "",
        position: edit ? singleNav?.position?.toString() : 0,
    };

    const resetAndNavigate = ({ error }) => {
        dispatch(clearError());
        dispatch(setMessage(""));
        !error && navigate(`/sites/${siteId}/navigation`);
    };

    const validationSchema = yup.object({
        name: yup.string().required("required field"),
        link: yup.string().required("required field"),
        position: yup.number().required("required field"),
    });

    useEffect(() => {
        dispatch(singleSiteRequest(siteId));
        if (edit) {
            dispatch(singleNavigationRequest(navId));
            return;
        }
    }, [dispatch, siteId, navId]);

    return (
        <>
            {successMessage && (
                <NotificationModal
                    modelOpen={successMessage}
                    message={successMessage}
                    modelClose={resetAndNavigate}
                />
            )}
            {errorMessage && (
                <NotificationModal
                    modelOpen={errorMessage}
                    message={errorMessage}
                    modelClose={resetAndNavigate}
                    error
                />
            )}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={submitFunction}
            >
                {({ values, isSubmitting }) => {
                    return (
                        <Form className="p-10 bg-gray-100">
                            <FieldBox
                                value={values.name}
                                name="name"
                                label="Navigation Name "
                            />
                            <FieldBox
                                value={values.link}
                                name="link"
                                label="Link "
                            />
                            <FieldBox
                                value={values.position}
                                name="position"
                                label="Position "
                            />
                            <div className="w-96 text-center my-5">
                                <button
                                    onClick={() => {}}
                                    disabled={false}
                                    className=" px-4 py-2 rounded bg-blue-700 text-white  disabled:bg-gray-200 "
                                    type="submit"
                                >
                                    Submit
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
}

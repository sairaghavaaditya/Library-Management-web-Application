import { Redirect } from "react-router-dom";
import { useOktaAuth  } from "@okta/okta-react";
import { SpinnerLoading } from "../layouts/Utils/SpinnerLoading";
import OktaSignInWidget from "./OktaSignInWidget";

const LoginWidget = ({config}) => {
    const { oktaAuth, authState } = useOktaAuth();

    const onSuccess = (token) => {
        oktaAuth.handleLoginRedirect(token);
    };

    const onError = (err) => {
        console.error('Sign in error: ',err);
    }

    if (!authState){
        return(
         <SpinnerLoading/>
        );
    }
     return authState.isAuthenticated ?
     <Redirect to={{ pathname: '/' }}/>
     :
     <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError}/>;
};


export default LoginWidget;
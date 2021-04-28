import React from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Field, InjectedFormProps } from 'redux-form'

import { HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import {
  FormError,
  FormGroup,
  FormItem,
  FormLabel,
  PasswordBox
} from 'components/Form'
import { selectors } from 'data'
import { required } from 'services/forms'

import { LoginSteps, Props as OwnProps } from '..'
import {
  ActionButton,
  BackArrowFormHeader,
  LinkRow,
  NeedHelpLink
} from '../model'

const EnterPassword = (props: InjectedFormProps<{}, Props> & Props) => {
  const {
    authType,
    busy,
    formValues,
    invalid,
    loginError,
    password,
    setStep,
    submitting
  } = props

  const passwordError =
    loginError && loginError.toLowerCase().includes('wrong_wallet_password')
  const accountLocked =
    loginError &&
    (loginError.toLowerCase().includes('this account has been locked') ||
      loginError.toLowerCase().includes('account is locked'))

  return (
    <>
      <BackArrowFormHeader formValues={formValues} setStep={setStep} />
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor='password'>
            <FormattedMessage
              id='scenes.login.enter_password'
              defaultMessage='Enter your password'
            />
          </FormLabel>
          <Field
            name='password'
            validate={[required]}
            component={PasswordBox}
            data-e2e='loginPassword'
            placeholder='Enter your password'
          />
          {passwordError && (
            <FormError data-e2e='passwordError' style={{ paddingTop: '5px' }}>
              <FormattedHTMLMessage
                id='scenes.login.wrong_password_recover'
                defaultMessage='Wrong password. Do you want to recover your wallet using Secret Private Key Recovery Phrase?'
              />
              {'  '}
              <LinkContainer to='/recover'>
                <Link size='12px' data-e2e='loginRecover'>
                  <FormattedMessage
                    id='scenes.login.recover_account'
                    defaultMessage='Recover account'
                  />
                  {'.'}
                </Link>
              </LinkContainer>
            </FormError>
          )}
          {accountLocked && (
            <FormError
              position={authType > 0 || passwordError ? 'relative' : 'absolute'}
            >
              {loginError}
            </FormError>
          )}
        </FormItem>
      </FormGroup>
      <LinkRow>
        <ActionButton
          type='submit'
          nature='primary'
          fullwidth
          height='48px'
          disabled={submitting || invalid || busy || !password}
          data-e2e='passwordButton'
          style={{ marginBottom: '16px' }}
        >
          {busy && !loginError ? (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          ) : (
            <Text color='whiteFade900' size='16px' weight={600}>
              <FormattedMessage
                id='scenes.login.login'
                defaultMessage='Log In'
              />
            </Text>
          )}
        </ActionButton>
        <NeedHelpLink />
      </LinkRow>
    </>
  )
}

const mapStateToProps = state => ({
  authType: selectors.auth.getAuthType(state)
})

const connector = connect(mapStateToProps)

type Props = OwnProps & {
  busy: boolean
  loginError?: string
  setStep: (step: LoginSteps) => void
} & ConnectedProps<typeof connector>

export default connector(EnterPassword)
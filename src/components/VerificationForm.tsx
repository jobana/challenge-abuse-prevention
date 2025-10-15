import React from 'react';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import { 
  Input, 
  Button, 
  Select, 
  LoadingSpinner, 
  ErrorMessage 
} from './ui';
import { useVerificationForm } from '../hooks/useVerificationForm';

export const VerificationForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    form,
    handleSubmit,
    resetForm,
    getFieldState,
    isSubmitting,
    isSuccess,
    error,
    countries,
    countriesLoading,
    countriesError,
    captchaRef,
    isCaptchaLoaded,
    isCaptchaVerified,
    captchaError,
    getCaptchaSiteKey,
    onCaptchaSuccess,
    onCaptchaExpired,
    onCaptchaError,
  } = useVerificationForm();

  const { register, formState: { errors, isValid, isDirty } } = form;

  // Si el formulario se envió exitosamente
  if (isSuccess) {
    return (
      <div className="successContainer">
        <div className="successIcon">
         
        </div>
        <h2 className="successTitle">
          {t('form.success.title')}
        </h2>
        <p className="successMessage">
          {t('form.success.message')}
        </p>
        <Button
          variant="primary"
          onClick={resetForm}
          className="resetButton"
        >
          {t('form.success.newVerification')}
        </Button>
      </div>
    );
  }

  return (
    <form 
      className="verificationForm"
      onSubmit={handleSubmit}
      noValidate
      aria-label={t('form.ariaLabel')}
    >
      <div className="verificationForm__header">
        <h1 className="verificationForm__title">
          {t('form.title')}
        </h1>
        <p className="verificationForm__title">
          {t('form.description')}
        </p>
      </div>

      {/* Error general del formulario */}
      {error && (
        <ErrorMessage
          message={error}
          type="error"
          className="formError"
        />
      )}

      <div className="verificationForm__content">
        {/* Campo Nombre */}
        <div className="verificationForm__field">
          <Input
            {...register('name')}
            type="text"
            label={t('form.fields.name.label')}
            placeholder={t('form.fields.name.placeholder')}
            required
            autoComplete="given-name"
            aria-describedby="name-error"
            className={getFieldState('name').hasError ? 'input__field--error' : ''}
          />
          {getFieldState('name').hasError && (
            <ErrorMessage
              id="name-error"
              message={getFieldState('name').errorMessage || ''}
              type="error"
              
            />
          )}
        </div>

        {/* Campo País */}
        <div className="verificationForm__field">
          <Select
            name="country"
            value={form.watch('country')}
            onChange={(value) => form.setValue('country', value)}
            label={t('form.fields.country.label')}
            placeholder={t('form.fields.country.placeholder')}
            required
            disabled={countriesLoading}
            aria-describedby="country-error"
            className={getFieldState('country').hasError ? 'fieldError' : ''}
            options={
              countriesLoading
                ? [{ value: '', label: t('form.fields.country.loading'), disabled: true }]
                : countriesError
                ? [{ value: '', label: t('form.fields.country.error'), disabled: true }]
                : [
                    { value: '', label: t('form.fields.country.placeholder'), disabled: true },
                    ...countries.map((country) => ({
                      value: country.id,
                      label: country.name,
                    }))
                  ]
            }
          />
          {getFieldState('country').hasError && (
            <ErrorMessage
              id="country-error"
              message={getFieldState('country').errorMessage || ''}
              type="error"
              
            />
          )}
        </div>

        {/* Campo Dirección */}
        <div className="verificationForm__field">
          <Input
            {...register('address')}
            type="text"
            label={t('form.fields.address.label')}
            placeholder={t('form.fields.address.placeholder')}
            required
            autoComplete="street-address"
            aria-describedby="address-error"
            className={getFieldState('address').hasError ? 'fieldError' : ''}
          />
          {getFieldState('address').hasError && (
            <ErrorMessage
              id="address-error"
              message={getFieldState('address').errorMessage || ''}
              type="error"
              
            />
          )}
        </div>
      </div>

      {/* CAPTCHA */}
      <div className="captchaContainer">
        {isCaptchaLoaded ? (
          <ReCAPTCHA
            ref={captchaRef}
            sitekey={getCaptchaSiteKey()}
            onChange={(token) => token && onCaptchaSuccess(token)}
            onExpired={onCaptchaExpired}
            onErrored={() => onCaptchaError('CAPTCHA verification failed')}
            theme="light"
            size="normal"
            hl={t('captcha.language')}
            aria-label={t('captcha.ariaLabel')}
          />
        ) : (
          <div className="captchaLoading">
            <LoadingSpinner size="small" />
            <span>{t('captcha.loading')}</span>
          </div>
        )}
        
        {captchaError && (
          <ErrorMessage
            message={captchaError}
            type="error"
            className="captchaError"
          />
        )}
      </div>

      {/* Botones del formulario */}
      <div className="verificationForm__actions">
        <Button
          type="button"
          variant="secondary"
          onClick={resetForm}
          disabled={isSubmitting}
          className="resetButton"
        >
          {t('form.actions.reset')}
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          
          className="submitButton"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="small" />
              {t('form.actions.submitting')}
            </>
          ) : (
            t('form.actions.submit')
          )}
        </Button>
      </div>
    </form>
  );
};

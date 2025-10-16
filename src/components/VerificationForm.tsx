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
import { DecodedQueryParams } from '../types/queryParams.types';

interface VerificationFormProps {
  initialData?: DecodedQueryParams;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({ initialData }) => {
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
    captchaError,
    getCaptchaSiteKey,
    onCaptchaSuccess,
    onCaptchaExpired,
    onCaptchaError,
  } = useVerificationForm(initialData);

  const { register } = form;

  return (
    <form 
      className="verificationForm"
      onSubmit={handleSubmit}
      noValidate
      aria-label={t('form.ariaLabel')}
    >


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
        <ReCAPTCHA
          ref={captchaRef}
          sitekey={getCaptchaSiteKey()}
          onChange={(token) => {
            token && onCaptchaSuccess(token);
          }}
          onExpired={() => {
            onCaptchaExpired();
          }}
          onErrored={() => {
            onCaptchaError('CAPTCHA verification failed');
          }}
          theme="light"
          size="normal"
          hl={t('captcha.language')}
          aria-label={t('captcha.ariaLabel')}
        />
      </div>

      {/* Mensaje de éxito */}
      {isSuccess && (
        <ErrorMessage
          message={t('form.success.message')}
          type="info"
          className="formSuccess"
        />
      )}

      {/* Error general del formulario - debajo del captcha */}
      {(error || captchaError) && !isSuccess && (
        <ErrorMessage
          message={error || captchaError || ''}
          type="error"
          className="formError"
        />
      )}

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

# flake8: noqa

selector_dict = {}
# APP
selector_dict['app_loader'] = 'xp://*[@name = "loader"]'
selector_dict['app_root_div'] = 'xp://*[@id = "root"]'
# LOCALE
selector_dict['locale_en_btn'] = 'xp://a[@data-locale = "en"]'
selector_dict['locale_fr_btn'] = 'xp://a[@data-locale = "fr"]'
# DASHBOARD
selector_dict['dashboard_page'] = 'xp://*[@name = "dashboard-page"]'
# COMPONENT LIBRARY
selector_dict['component_library_page'] = 'xp://*[@name = "components-library-page"]'
# PRIVACY
selector_dict['privacy_page'] = 'xp://*[@name = "privacy-policy-page"]'
# HEADER
selector_dict['header_privacy_policy_banner'] = 'xp://*[@class = "react-cookie-banner"]'
selector_dict['header_privacy_policy_banner_link'] = 'xp://*[@class = "react-cookie-banner"]//*[@class = "cookie-link"]'
selector_dict['header_privacy_policy_banner_gotit_btn'] = 'xp://*[@class = "react-cookie-banner"]//*[@class = "button-close"]'
selector_dict['header_home_link'] = 'xp://*[@name = "home-link"]'
selector_dict['header_user_dropdown'] = 'xp://*[@name = "user-dropdown"]'
selector_dict['header_user_dropdown_open'] = 'xp://*[@name = "user-dropdown" and contains(@class, "open")]'
selector_dict['header_logout_btn'] = 'xp://*[@name = "logout-link"]'
selector_dict['header_login_link'] = 'xp://*[@name = "login-link"]'
selector_dict['header_register_link'] = 'xp://*[@name = "register-link"]'
selector_dict['header_profile_link'] = 'xp://*[@name = "profile-link"]'
selector_dict['header_user_icon'] = 'xp://img[@name = "user-icon"]'
# REGISTER
selector_dict['register_email_input_has_warning'] = 'xp://input[@name = "email"]//ancestor::div[contains(@class, "has-warning")]'
selector_dict['register_name_input_has_warning'] = 'xp://input[@name = "name"]//ancestor::div[contains(@class, "has-warning")]'
selector_dict['register_password_input_has_warning'] = 'xp://input[@name = "password"]//ancestor::div[contains(@class, "has-warning")]'
selector_dict['register_email_input_has_success'] = 'xp://input[@name = "email"]//ancestor::div[contains(@class, "has-success")]'
selector_dict['register_name_input_has_success'] = 'xp://input[@name = "name"]//ancestor::div[contains(@class, "has-success")]'
selector_dict['register_password_input_has_success'] = 'xp://input[@name = "password"]//ancestor::div[contains(@class, "has-success")]'
selector_dict['register_email_input_has_error'] = 'xp://input[@name = "email"]//ancestor::div[contains(@class, "has-error")]'
selector_dict['register_name_input_has_error'] = 'xp://input[@name = "name"]//ancestor::div[contains(@class, "has-error")]'
selector_dict['register_password_input_has_error'] = 'xp://input[@name = "password"]//ancestor::div[contains(@class, "has-error")]'
selector_dict['register_email_input'] = 'xp://input[@name = "email"]'
selector_dict['register_name_input'] = 'xp://input[@name = "name"]'
selector_dict['register_password_input'] = 'xp://input[@name = "password"]'
selector_dict['register_submit_btn'] = 'xp://button[@name = "register-btn"]'
selector_dict['register_submit_btn_disabled'] = 'xp://button[@name = "register-btn" and @disabled]'
selector_dict['register_already_have_account_link'] = 'xp://*[@name = "already-having-account-link"]'
# LOGIN
selector_dict['login_email_input_has_warning'] = 'xp://input[@name = "email"]//ancestor::div[contains(@class, "has-warning")]'
selector_dict['login_password_input_has_warning'] = 'xp://input[@name = "password"]//ancestor::div[contains(@class, "has-warning")]'
selector_dict['login_email_input_has_success'] = 'xp://input[@name = "email"]//ancestor::div[contains(@class, "has-success")]'
selector_dict['login_password_input_has_success'] = 'xp://input[@name = "password"]//ancestor::div[contains(@class, "has-success")]'
selector_dict['login_email_input_has_error'] = 'xp://input[@name = "email"]//ancestor::div[contains(@class, "has-error")]'
selector_dict['login_password_input_has_error'] = 'xp://input[@name = "password"]//ancestor::div[contains(@class, "has-error")]'
selector_dict['login_dont_have_account_link'] = 'xp://*[@name = "dont-have-account-link"]'
selector_dict['login_forgotten_password_link'] = 'xp://*[@name = "forgottenpassword-link"]'
selector_dict['login_email_input'] = 'xp://input[@name = "email"]'
selector_dict['login_password_input'] = 'xp://input[@name = "password"]'
selector_dict['login_submit_btn'] = 'xp://button[@name = "login-btn"]'
selector_dict['login_submit_btn_disabled'] = 'xp://button[@name = "login-btn" and @disabled]'
# PROFILE
selector_dict['profile_email_input'] = 'xp://input[@name = "email"]'
selector_dict['profile_name_input'] = 'xp://input[@name = "name"]'
selector_dict['profile_old_password_input'] = 'xp://input[@name = "old_password"]'
selector_dict['profile_new_password_input'] = 'xp://input[@name = "new_password"]'
selector_dict['profile_submit_btn'] = 'xp://button[@name = "profile-btn"]'
selector_dict['profile_submit_btn_disabled'] = 'xp://button[@name = "profile-btn" and @disabled]'
selector_dict['profile_email_verified_div'] = 'xp://*[@name = "email-verified"]'
selector_dict['profile_email_not_verified_div'] = 'xp://*[@name = "email-not-verified"]'
selector_dict['profile_success_banner'] = 'xp://*[@name = "profile.settingsSaveSuccessfully"]'
# FORGOTTEN PASSWORD
selector_dict['forgottenpassword_page'] = 'xp://*[@name = "forgotten-password-page"]'

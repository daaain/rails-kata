require 'test_helper'
require 'capybara/rails'
require 'selenium/webdriver'

selenium_url = ENV.fetch('SELENIUM_URL') { 'http://selenium:4444' }

Capybara.register_driver :selenium_container do |app|
  Capybara::Selenium::Driver.new(
    app,
    browser: :remote,
    url: "#{selenium_url}/wd/hub",
    desired_capabilities: Selenium::WebDriver::Remote::Capabilities.chrome(
      'goog:chromeOptions' => {
        'args' => [
          '--no-default-browser-check',
          '--start-maximized',
          '--ash-host-window-bounds 1024x768*2',
          '--verbose'
        ]
      }
    )
  )
end

Capybara.configure do |config|
  config.server_host = ENV.fetch('TEST_RAILS_BASE_URL') { 'test' }
  config.server_port = 3001

  config.default_max_wait_time = 6
  config.default_driver = :selenium
  config.javascript_driver = :selenium
end

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium_container
end

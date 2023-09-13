class Call < ApplicationRecord

  

  BlizzardApi.configure do |config|
    config.app_id = ENV['BLIZZARD_CLIENT_ID']
    config.app_secret = ENV['BLIZZARD_CLIENT_SECRET']
    config.region = 'us'
    config.use_cache = true
    config.redis_host = ENV['REDIS_HOST']
    config.redis_port = ENV['REDIS_PORT']
  end
end

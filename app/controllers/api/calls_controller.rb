module Api
  class CallsController < ApplicationController
    BlizzardApi.configure do |config|
      config.app_id = ENV['BLIZZARD_CLIENT_ID']
      config.app_secret = ENV['BLIZZARD_CLIENT_SECRET']
      config.region = 'us'
      config.use_cache = true
      config.redis_host = ENV['REDIS_HOST']
      config.redis_port = ENV['REDIS_PORT']
    end

    def region
      region = BlizzardApi::Wow.region
      region_data = region.index

      render json: region_data
    end

    def realm
      realm = BlizzardApi::Wow.realm
      realm_data = realm.index

      render json: realm_data
    end
  end
end

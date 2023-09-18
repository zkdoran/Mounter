module Api
  class CallsController < ApplicationController
    BlizzardApi.configure do |config|
      config.app_id = ENV['BLIZZARD_CLIENT_ID']
      config.app_secret = ENV['BLIZZARD_CLIENT_SECRET']
      config.region = 'us'
      config.use_cache = true
      config.redis_host = ENV['REDIS_HOST']
      config.redis_port = ENV['REDIS_PORT']
      config.cache_access_token = true
    end

    def realms
      realm = BlizzardApi::Wow::Realm.new region: params[:region]

      @realm_data = realm.index

      render json: @realm_data , status: :ok
    end

    def mounts
      mount = BlizzardApi::Wow::Mount.new
      
      @mount_index = mount.index

      render json: @mount_index, status: :ok
    end

    def profile
      character = BlizzardApi::Wow::CharacterProfile.new region: params[:region]

      @character_data = character.get(params[:realm], params[:character])

      @character_data[:mounts] = character.mounts(params[:realm], params[:character])

      render json: @character_data, status: :ok
    end
  end
end
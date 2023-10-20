class CharacterExistenceChecker
  # Configure Blizzard Api
  BlizzardApi.configure do |config|
    config.app_id = ENV['BLIZZARD_CLIENT_ID']
    config.app_secret = ENV['BLIZZARD_CLIENT_SECRET']
    config.region = 'us'
    config.use_cache = false
    config.redis_host = ENV['REDIS_HOST']
    config.redis_port = ENV['REDIS_PORT']
    config.cache_access_token = true
  end

  # Does a call to the Blizzard API to check if a character exists
  # Returns true if the character exists, false if it does not
  def self.character_exists?(params)
    character_info = params[:character]
    region = character_info[:region]
    realm = character_info[:realm]
    name = character_info[:name]

    begin
      character = BlizzardApi::Wow::CharacterProfile.new region: region
      character_data = character.get(realm, name)
      character_data.key?(:name)
    rescue
      false
    end
  end
end

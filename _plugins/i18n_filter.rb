module Jekyll
  module I18nFilter
    def t(key, lang = nil)
      lang ||= @context.registers[:page]['lang'] || @context.registers[:site].config['lang'] || 'en'
      
      translations = @context.registers[:site].data['portfolio']
      keys = key.split('.')
      
      result = translations[lang]
      keys.each do |k|
        result = result[k] if result
      end
      
      result || key
    end
  end
end

Liquid::Template.register_filter(Jekyll::I18nFilter)

